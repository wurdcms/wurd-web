'use strict';

/**
 * @param {Object} data
 *
 * @return {String}
 */
function encodeQueryString(data) {
  const parts = Object.keys(data).map(key => {
    const value = data[key];

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  return parts.join('&');
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

  return text.replace(/{{([\w.-]+)}}/g, (_, key) => vars[key] || '');
}

class Store {

  /**
   * @param {Object} rawContent           Initial content
   * @param {String} opts.storageKey      localStorage key
   * @param {Number} opts.ttl             cache time to live in ms (defaults to 1 hour)
   */
  constructor(rawContent = {}, opts = {}) {
    this.rawContent = rawContent;
    this.storageKey = opts.storageKey || 'wurdContent';
    this.ttl = opts.ttl ?? 3600000;
  }

  /**
   * Get a specific piece of content, top-level or nested
   *
   * @param {String} path e.g. 'section','section.subSection','a.b.c.d'
   * @return {Mixed}
   */
  get(path) {
    if (!path) return this.rawContent;

    return path.split('.').reduce((acc, k) => acc && acc[k], this.rawContent);
  }

  /**
   * Load top-level sections of content from localStorage
   *
   * @param {String[]} sectionNames Names of top-level content sections to load e.g. ['main','nav']
   *    Unused here but likely to be used in future/other Store implementation
   * @param {Object} [options]
   * @param {String} [options.lang] Language
   * @return {Object} content
   */
  load(sectionNames, { lang } = {}) {
    const { rawContent, storageKey, ttl } = this;

    try {
      // Find cached content
      const cachedContent = JSON.parse(localStorage.getItem(storageKey));
      const metaData = cachedContent && cachedContent._wurd;

      // Check if it has expired
      if (!cachedContent || !metaData || (metaData.savedAt + ttl) < Date.now()) {
        return rawContent;
      }

      // Check it's in the correct language
      if (metaData.lang !== lang) {
        return rawContent;
      }

      // Remove metadata
      delete cachedContent['_wurd'];

      // Add cached content to memory content
      Object.assign(rawContent, cachedContent);

      return rawContent;
    } catch (err) {
      console.error('Wurd: error loading cache:', err);

      return rawContent;
    }
  }

  /**
   * Save top-level sections of content to localStorage
   *
   * @param {Object} sections
   * @param {Boolean} [options.cache] Whether to save the content to cache
   */
  save(sections, { lang } = {}) {
    const { rawContent, storageKey } = this;

    Object.assign(rawContent, sections);

    localStorage.setItem(storageKey, JSON.stringify({
      ...rawContent,
      _wurd: {
        savedAt: Date.now(),
        lang,
      },
    }));
  }

  /**
   * Clears the localStorage cache
   */
  clear() {
    localStorage.removeItem(this.storageKey);
  }

}

class Block {

  constructor(wurd, path) {
    this.wurd = wurd;
    this.path = path;

    // Private shortcut to the main content getter
    // TODO: Make a proper private variable
    // See http://voidcanvas.com/es6-private-variables/ - but could require Babel Polyfill to be included
    this._get = wurd.store.get.bind(wurd.store);

    // Bind methods to the instance to enable 'this' to be available
    // to own methods and added helper methods;
    // This also allows object destructuring, for example:
    // `const {text} = wurd.block('home')`
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    methodNames.forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  /**
   * Gets the ID of a child content item by path (e.g. id('item') returns `block.item`)
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {String}
   */
  id(path) {
    if (!path) return this.path;

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
    const result = this._get(this.id(path));

    // If an item is missing, check that the section has been loaded
    if (typeof result === 'undefined' && this.wurd.draft) {
      const section = path.split('.')[0];

      if (!this._get(section)) {
        console.warn(`Tried to access unloaded section: ${section}`);
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
      return (this.wurd.draft) ? `[${path}]` : '';
    }

    if (typeof text !== 'string') {
      console.warn(`Tried to get object as string: ${path}`);

      return (this.wurd.draft) ? `[${path}]` : '';
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
   * @param {Boolean} [opts.inline]
   *
   * @return {Mixed}
   */
  markdown(path, vars, opts) {
    const { parse, parseInline } = this.wurd.markdown;
    const text = this.text(path, vars);

    if (opts?.inline && parseInline) {
      return parseInline(text);
    }

    if (parse) {
      return parse(text);
    }

    return text;
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
    const blockPath = this.id(path);

    const childBlock = new Block(this.wurd, blockPath);

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

    if (this.wurd.draft) {
      let type = options.type || 'span';

      if (options.markdown) type = 'div';

      return `<${type} ${editor}="${id}">${text}</${type}>`;
    }

    return text;
  }

  /**
   * Returns the block helpers, bound to the block instance.
   * This is useful if using object destructuring for shortcuts,
   * for example `const {text, el} = block.bound()`
   *
   * @return {Object}
   */
  /*
  helpers(path) {
    const block = path ? this.block(path) : this;

    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(block));

    const boundMethods = methodNames.reduce((memo, name) => {
      if (name === 'constructor') return memo;

      memo[name] = block[name].bind(block);
      return memo;
    }, {});

    return boundMethods;
  }
  */

}

const WIDGET_URL = 'https://widget.wurd.io/widget.js';
const API_URL = 'https://api.wurd.io';


class Wurd {
  /**
   * @param {String} appName
   */
  constructor(appName, options = {}) {
    this.store = new Store();
    this.content = new Block(this, null);

    // Add block shortcut methods to the main Wurd instance
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.content));

    methodNames.forEach(name => {
      this[name] = this.content[name].bind(this.content);
    });

    this.connect(appName, options);
  }

  /**
   * Sets up the default connection/instance
   *
   * @param {String} appName
   * @param {Object} [options]
   * @param {Boolean} [options.lang] Specific language to use
   * @param {Boolean|String} [options.editMode] Options for enabling edit mode: `true` or `'querystring'`
   * @param {Boolean} [options.draft] If true, loads draft content; otherwise loads published content
   * @param {Object} [options.markdown] Enable markdown parsing. Works directly with `marked` npm package
   *                                    or an object of shape {parse: Function, parseInline: Function}
   * @param {Object} [options.blockHelpers] Functions to help accessing content and creating editable regions
   * @param {Object} [options.rawContent] Content to populate the store with
   * @param {Function} [options.onLoad] Callback that runs whenever load() completes. Signature: onLoad(content) => {}
   */
  connect(appName, options = {}) {
    this.app = appName;

    this.draft = false;
    this.editMode = false;

    // Set allowed options
    ['draft', 'lang', 'markdown', 'debug', 'onLoad'].forEach(name => {
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

    if (options.rawContent) {
      this.store.save(options.rawContent, { lang: options.lang });
    }

    if (options.storageKey) this.store.storageKey = options.storageKey;
    if (options.ttl) this.store.ttl = options.ttl;

    if (options.blockHelpers) {
      this.setBlockHelpers(options.blockHelpers);
    }

    return this;
  }

  /**
   * Loads sections of content so that items are ready to be accessed with #get(id)
   *
   * @param {String|Array<String>} sectionNames     Top-level sections to load e.g. `main,home`
   */
  load(sectionNames) {
    const {app, store, lang, editMode, debug, onLoad, content} = this;

    if (!app) {
      return Promise.reject(new Error('Use wurd.connect(appName) before wurd.load()'));
    }

    // Normalise string sectionNames to array
    const sections = typeof sectionNames === 'string' ? sectionNames.split(',') : sectionNames;

    // When in editMode we skip the cache completely
    if (editMode) {
      return this._fetchSections(sections)
        .then(result => {
          store.save(result, { lang });

          // Clear the cache so changes are reflected immediately when out of editMode
          store.clear();

          // Pass main content Block to callbacks
          if (onLoad) onLoad(content);

          return content;
        });
    }

    // Check for cached sections
    const cachedContent = store.load(sections, { lang });

    const uncachedSections = sections.filter(section => cachedContent[section] === undefined);

    if (debug) console.info('Wurd: from cache:', sections.filter(section => cachedContent[section] !== undefined));

    // Return now if all content was in cache
    if (uncachedSections.length === 0) {
      // Pass main content Block to callbacks
      if (onLoad) onLoad(content);

      return Promise.resolve(content);
    }

    // Otherwise fetch remaining sections
    return this._fetchSections(uncachedSections)
      .then(result => {
        // Cache for next time
        store.save(result, { lang });

        // Pass main content Block to callbacks
        if (onLoad) onLoad(content);

        return content;
      });
  }

  _fetchSections(sectionNames) {
    const {app, debug} = this;

    // Some sections not in cache; fetch them from server
    if (debug) console.info('Wurd: from server:', sectionNames);

    // Build request URL
    const params = ['draft', 'lang'].reduce((memo, param) => {
      if (this[param]) memo[param] = this[param];

      return memo;
    }, {});

    const url = `${API_URL}/apps/${app}/content/${sectionNames}?${encodeQueryString(params)}`;

    return this._fetch(url)
      .then(result => {
        if (result.error) {
          if (result.error.message) {
            throw new Error(result.error.message);
          } else {
            throw new Error(`Error loading ${sectionNames}`);
          }
        }
        return result;
      });
  }

  _fetch(url) {
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Error loading ${url}: ${res.statusText}`);

        return res.json();
      });
  }

  startEditor() {
    const {app, lang} = this;

    // Draft mode is always on if in edit mode
    this.editMode = true;
    this.draft = true;

    const script = document.createElement('script');

    script.src = WIDGET_URL;
    script.async = true;
    script.setAttribute('data-app', app);

    if (lang) {
      script.setAttribute('data-lang', lang);
    }

    const prevScript = document.body.querySelector(`script[src="${WIDGET_URL}"]`);

    if (prevScript) {
      document.body.removeChild(prevScript);
    }

    document.body.appendChild(script);
  }

  setBlockHelpers(helpers) {
    Object.assign(Block.prototype, helpers);
  }

}

const instance = new Wurd();

instance.Wurd = Wurd;

module.exports = instance;
