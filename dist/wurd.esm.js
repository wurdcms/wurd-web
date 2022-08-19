import { marked } from 'marked';

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
   * @param {Object} rawContent            Initial content
   * @param {String} opts.storageKey       localStorage key
   * @param {Number} opts.maxAge           cache max-age in ms
   */
  constructor(rawContent = {}, opts = {}) {
    this.rawContent = rawContent;
    this.storageKey = opts.storageKey || 'cmsContent';
    this.maxAge = opts.maxAge ?? 3600000;
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
   * Save content in cache
   *
   * @param {Object} content
   */
  set(content) {
    return Object.assign(this.rawContent || {}, content);
  }

  /**
   * Load content from localStorage
   *
   * @return {Object}
   */
  load() {
    try {
      const cachedContent = JSON.parse(localStorage.getItem(this.storageKey));

      // console.log('..', localStorage.getItem(this.storageKey), global.localStorage.getItem());

      if (!cachedContent || !cachedContent._expiry || cachedContent._expiry < Date.now()) {
        return this.rawContent;
      }

      this.rawContent = cachedContent;

      return this.rawContent;
    } catch (err) {
      console.error('Wurd: error loading cache:', err);

      return this.rawContent;
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify({ ...this.rawContent, _expiry: Date.now() + this.maxAge }));
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
    const text = this.text(path, vars);

    if (opts?.inline && marked.parseInline) {
      return marked.parseInline(text);
    }

    return marked.parse(text);
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
   * @param {String} [options.storageKey='cmsContent']         localStorage key for caching content
   */
  constructor(appName, options) {
    this.store = new Store(options && options.storageKey);
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
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   * @param {Object} [options.blockHelpers]       Functions to help accessing content and creating editable regions
   * @param {Object} [options.rawContent]         Content to populate the store with
   */
  connect(appName, options = {}) {
    this.app = appName;

    this.draft = false;
    this.editMode = false;

    // Set allowed options
    ['draft', 'lang', 'debug'].forEach(name => {
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
      this.store.set(options.rawContent);
    }

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
    const {app, store, editMode, debug} = this;

    if (!app) {
      return Promise.reject(new Error('Use wurd.connect(appName) before wurd.load()'));
    }

    // Normalise string sectionNames to array
    const sections = typeof sectionNames === 'string' ? sectionNames.split(',') : sectionNames;

    // Check for cached sections
    const cachedContent = store.load();

    const uncachedSections = cachedContent ?
      sections.filter(section => cachedContent[section] === undefined) :
      sections;

    if (debug) console.info('Wurd: from cache:', sections.filter(section => cachedContent?.[section] !== undefined));

    // Return now if all content was in cache
    if (!editMode && uncachedSections.length === 0) {
      return Promise.resolve(this.content);
    }

    // Some sections not in cache; fetch them from server
    if (debug) console.info('Wurd: from server:', uncachedSections);

    return this._fetchSections(uncachedSections)
      .then(fetchedContent => {
        // Cache for next time
        store.set(fetchedContent);
        store.save();

        // Return the main Block instance for using content
        return this.content;
      });
  }

  _fetchSections(sectionNames) {
    const {app} = this;

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

export { instance as default };
