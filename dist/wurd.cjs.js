'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var marked = _interopDefault(require('marked'));
var getValue = _interopDefault(require('get-property-value'));

class MemoryCache {

  constructor() {
    this.items = {};
  }

  /**
   * @param {String} key
   *
   * @resolves {Object|Undefined}
   */
  get(key) {
    return Promise.resolve(this.items[key]);
  }

  /**
   * @param {String} key
   * @param {Object} val
   *
   * @resolves
   */
  set(key, val) {
    this.items[key] = val;
    return Promise.resolve();
  }

}

class Store {

  /**
   * @param {Object} rawContent       Initial content
   */
  constructor(rawContent = {}) {
    this.rawContent = rawContent;
  }

  /**
   * @param {String} itemId     ID/path of content item to get e.g. `main.title`
   *
   * @return {Mixed}
   */
  get(itemId) {
    return getValue(this.rawContent, itemId);
  }

  /**
   * @param {Object} containers       Content of top-level containers
   */
  set(containers) {
    Object.assign(this.rawContent, containers);
  }

}

/**
 * Replaces {{mustache}} style placeholders in text with variables
 *
 * @param {String} text
 * @param {Object} vars
 *
 * @return {String}
 */
function replaceVars(text, vars = {}) {
  if (typeof text !== 'string') return text;

  Object.entries(vars).forEach(([key, val]) => {
    text = text.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });

  return text;
}


/**
 * Returns the key for caching a block of content, including the language
 *
 * @param {String} containerId
 * @param {Object} [options]
 *
 * @return {String} cacheId
 */
function getCacheId(containerId, options = {}) {
  const lang = options.lang || '';

  return `${lang}/${containerId}`;
}

const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';

const cache = new MemoryCache();


class Wurd {
  /**
   * @constructor
   * @param {String} appName            The Wurd app/project name
   * @param {Object} [options]
   * @param {Object} [options.cache]    Optional custom cache; defaults to a simple in-memory cache
   * @param {Function} [options.fetch]  On Node pass in `require('node-fetch')`
   * @param {Object} [options.content]  Initial content
   */
  /* constructor(appName, options = {}) {
    this.content = new Block(appName, null, {}, options);

    this.cache = options.cache || cache;
    this.fetch = options.fetch || window.fetch.bind(window);

    // Add block shortcut methods to the main Wurd instance
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.content));

    methodNames.forEach(name => {
      this[name] = this.content[name].bind(this.content);
    });

    this.connect(appName, options);
  } */

  constructor(app, options) {
    this.connect(app, options);
  }

  /**
   * Sets up the default connection/instance
   *
   * @param {String} app                          The Wurd app/project name
   * @param {Object} [options]
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   * @param {Object} [options.blockHelpers]       Functions to help accessing content and creating editable regions
   * @param {Function} [options.fetch]            On Node pass in `require('node-fetch')`
   * @param {Object} [options.cache]              Optional custom cache; defaults to a simple in-memory cache
   * @param {Object} [options.rawContent]         Initial content
   */
  connect(app, options = {}) {
    this.app = app;
    this.store = new Store(options.rawContent);

    this.cache = options.cache || cache;
    this.fetch = options.fetch || (typeof window !== 'undefined' && window.fetch.bind(window));

    this.draft = false;
    this.editMode = false;

    // Set allowed options
    ['path', 'draft', 'lang', 'log'].forEach(name => {
      const val = options[name];

      if (typeof val !== 'undefined') this[name] = val;
    });

    // Activate edit mode if required
    switch (options.editMode) {
      // Edit mode always on
      case true:
        this.startEditor();
        break;

      // Activate edit mode if the querystring contains an 'edit' parameter e.g. '?edit'
      case 'querystring':
        if (/[?&]edit(&|$)/.test(location.search)) {
          this.startEditor();
        }
        break;
    }

    if (options.blockHelpers) {
      this.setBlockHelpers(options.blockHelpers);
    }

    return this;
  }

  /**
   * Returns options object with overrides applied
   *
   * @param {Object} overrideOptions
   * @return {Object}
   */
  getOptions(overrideOptions) {
    return Object.assign({}, {
      path: this.path,
      lang: this.lang,
      draft: this.draft,
      editMode: this.editMode,
      log: this.log,
    }, overrideOptions);
  }

  fetchContent(url) {
    return this.fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching ${url}: ${res.statusText}`);

        return res.json();
      });
  }

  /**
   * Loads content containers so that items are ready to be accessed with #get(id)
   *
   * @param {String|String[]} containerIds    Top-level container IDs e.g. `['main','home']`
   * @param {Object} [options]                Options that override the defaults provided in constructor/connect
   * @resolves {Block}
   */
  load(containerIds, tmpOptions = {}) {
    return new Promise((resolve, reject) => {
      // Normalise ids to array
      if (typeof containerIds === 'string') containerIds = containerIds.split(',');

      // Merge default and request options
      const options = this.getOptions(tmpOptions);

      // Force draft to true if in editMode
      if (options.editMode === true) {
        options.draft = true;
      }

      const { app } = this;

      if (!app) return reject(new Error('Use `wurd.connect(appName)` before `wurd.load()`'));

      options.log && console.log('loading: ', containerIds, options);

      // If in draft, skip cache
      if (options.draft) {
        return this._loadFromServer(containerIds, options)
          .then((content) => {
            // resolve(new Block(app, null, content, options));
            this.store.set(content);
            resolve(this);
          })
          .catch(reject);
      }

      // Otherwise not in draft mode; check for cached versions
      this._loadFromCache(containerIds, options)
        .then((cachedContent) => {
          const uncachedIds = Object.keys(cachedContent).filter((id) => (
            cachedContent[id] === undefined
          ));

          // If all content was cached, return it without a server trip
          if (!uncachedIds.length) {
            return cachedContent;
          }

          return this._loadFromServer(uncachedIds, options)
            .then((fetchedContent) => {
              this._saveToCache(fetchedContent, options);

              return Object.assign(cachedContent, fetchedContent);
            });
        })
        .then((allContent) => {
          this.store.set(allContent);
          // resolve(new Block(app, null, allContent, options));
          resolve(this);
        })
        .catch(reject);

      return null;
    });
  }

  startEditor() {

    const { app, lang } = this;

    // Draft mode is always on if in edit mode
    this.editMode = true;
    this.draft = true;

    // Only run in browser
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');

      script.src = WIDGET_URL;
      script.async = true;
      script.setAttribute('data-app', app);

      if (lang) {
        script.setAttribute('data-lang', lang);
      }

      document.getElementsByTagName('body')[0].appendChild(script);
    }
  }

  /**
   * Makes custom getter functions available on each `Block` of content.
   * For an example of how these work check the `Block.el()` definition.
   * The methods can use built-in `Block` methods such as `block.text()` etc.
   *
   * @param {Object} helpers
   */
  setBlockHelpers(helpers) {
    Object.assign(this.prototype, helpers);
  }

  /**
   * @param {Object} allContent    Content keyed by containerId (i.e. the response from the Wurd content API)
   *
   * @return {Promise}
   */
  _saveToCache(allContent, options = {}) {
    const promises = Object.keys(allContent).map((containerId) => {
      const container = allContent[containerId];

      return this.cache.set(getCacheId(containerId, options), container);
    });

    return Promise.all(promises);
  }

  /**
   * @param {String[]} containerIds   Top level containerIds to load content for
   *
   * @resolves {Object} content
   */
  _loadFromCache(containerIds, options = {}) {
    const allContent = {};

    const promises = containerIds.map((containerId) => {
      return this.cache.get(getCacheId(containerId, options))
        .then((container) => {
          allContent[containerId] = container;
        });
    });

    return Promise.all(promises).then(() => allContent);
  }

  /**
   * @param {String[]} containerIds   Top level containerIds to load content for
   * @param {Object} [options]
   *
   * @resolves {Object} content
   */
  _loadFromServer(containerIds, { draft, lang, log }) {
    const { app } = this;

    const containers = containerIds.join(',');
    const params = {};

    if (draft) params.draft = 1;
    if (lang) params.lang = lang;

    const url = `${API_URL}/apps/${app}/content/${containers}?${new URLSearchParams(params)}`;

    log && console.info('from server: ', containerIds);

    return this.fetchContent(url);
  }

  /**
   * Gets the ID of a child content item by path (e.g. id('item') returns `block.item`)
   *
   * @param {String} path       Item path e.g. `blockId.itemId`
   *
   * @return {String}
   */
  id(path) {
    if (!path) return this.path || null;

    return this.path ? [this.path, path].join('.') : path;
  }

  /**
   * Gets a content item by path (e.g. `section.item`).
   * Will return both text and/or objects, depending on the contents of the item
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {Mixed}
   */
  get(path) {
    const itemId = this.id(path);
    // const result = getValue(this.content, itemId);
    const result = this.store.get(itemId);

    // If an item is missing, check that the parent block has been loaded
    if (typeof result === 'undefined' && this.draft) {
      const blockId = itemId.split('.')[0];

      // if (!getValue(this.content, blockId)) {
      if (!this.store.get(blockId)) {
        console.warn(`Tried to access unloaded section: ${blockId}`);
      }
    }

    return result;
  }

  /**
   * Gets text content of an item by path (e.g. `section.item`).
   * If the item is not a string, e.g. you have passed the path of an object,
   * an empty string will be returned, unless in draft mode in which case a warning will be returned.
   *
   * @param {String} path       Item path e.g. `section.item`
   * @param {Object} [vars]     Variables to replace in the text
   *
   * @return {Mixed}
   */
  text(path, vars) {
    let text = this.get(path);

    if (typeof text === 'undefined') {
      return (this.draft) ? `[${path}]` : '';
    }

    if (typeof text !== 'string') {
      console.warn(`Tried to get object as string: ${path}`);

      return (this.draft) ? `[${path}]` : '';
    }

    if (vars) {
      text = replaceVars(text, vars);
    }

    return text;
  }

  /**
   * Gets HTML from Markdown content of an item by path (e.g. `section.item`).
   * If the item is not a string, e.g. you have passed the path of an object,
   * an empty string will be returned, unless in draft mode in which case a warning will be returned.
   *
   * @param {String} path       Item path e.g. `section.item`
   * @param {Object} [vars]     Variables to replace in the text
   *
   * @return {Mixed}
   */
  markdown(path, vars) {
    return marked(this.text(path, vars));
  }

  /**
   * Iterates over a collection / list object with the given callback.
   *
   * @param {String} path
   * @param {Function} fn     Callback function with signature ({Function} itemBlock, {Number} index)
   */
  map(path, fn) {
    const listContent = this.get(path) || { [Date.now()]: {} };

    let index = 0;

    const keys = Object.keys(listContent).sort();

    return keys.map(key => {
      const currentIndex = index;

      index++;

      const itemPath = [path, key].join('.');
      const itemBlock = this.block(itemPath);

      return fn.call(undefined, itemBlock, currentIndex);
    });
  }

  /**
   * Creates a new Block scoped to the child content.
   * Optionally runs a callback with the block as the argument
   *
   * @param {String} path
   * @param {Function} [fn]     Optional callback that receives the child block object
   *
   * @return {Block}
   */
  block(path, fn) {
    const fullPath = this.id(path);

    /* const childBlock = new Block(this.app, fullPath, this.get(path), {
      lang: this.lang,
      draft: this.draft,
      editMode: this.editMode,
    }); */

    const childBlock = new Wurd(this.app, this.getOptions({ path: fullPath }));

    childBlock.store = this.store;
    childBlock.cache = this.cache;

    if (typeof fn === 'function') {
      return fn.call(undefined, childBlock);
    }

    return childBlock;
  }

  /**
   * Returns an HTML string for an editable element.
   *
   * This is a shortcut for writing out the HTML tag
   * with the wurd editor attributes and the text content.
   *
   * Use this or create a similar helper to avoid having to type out the item paths twice.
   *
   * @param {String} path
   * @param {Object} [vars]               Optional variables to replace in the text
   * @param {Object} [options]
   * @param {Boolean} [options.markdown]  Parses text as markdown
   * @param {String} [options.type]       HTML node type, defaults to 'span', or 'div' for markdown content
   *
   * @return {String}
   */
  el(path, vars, options = {}) {
    const id = this.id(path);
    const text = options.markdown ? this.markdown(path, vars) : this.text(path, vars);
    const editor = (vars || options.markdown) ? 'data-wurd-md' : 'data-wurd';

    if (this.draft) {
      let type = options.type || 'span';

      if (options.markdown) type = 'div';

      return `<${type} ${editor}="${id}">${text}</${type}>`;
    }

    return text;
  }

  /**
   * Returns the HTML script tag which starts the Wurd editor
   *
   * @return {String}
   */
  includeEditor() {
    if (!this.editMode) return '';

    const { app, lang } = this;

    return `<script src="https://edit-v3.wurd.io/widget.js" data-app="${app}" data-lang="${lang || ''}"></script>`;
  }
}


/**
 * Export an client instance so it can be used directly, e.g.:
 * ```
 * import wurd from 'wurd';
 * wurd.load('main')
 * ```
 */
const instance = new Wurd();

instance.Wurd = Wurd;

module.exports = instance;
