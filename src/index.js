import { encodeQueryString } from './utils';

import Store from './store';
import Block from './block';


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
   */
  connect(appName, options = {}) {
    this.app = appName;

    this.draft = false;
    this.editMode = false;

    // Set allowed options
    ['draft', 'lang', 'markdown', 'debug'].forEach(name => {
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

      default:
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
    const {app, store, lang, editMode, debug} = this;

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

          return this.content;
        });
    }

    // Check for cached sections
    const cachedContent = store.load(sections, { lang });

    const uncachedSections = sections.filter(section => cachedContent[section] === undefined);

    if (debug) console.info('Wurd: from cache:', sections.filter(section => cachedContent[section] !== undefined));

    // Return now if all content was in cache
    if (uncachedSections.length === 0) {
      return Promise.resolve(this.content);
    }

    // Otherwise fetch remaining sections
    return this._fetchSections(uncachedSections)
      .then(result => {
        // Cache for next time
        store.save(result, { lang });

        return this.content;
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
        };

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

};


const instance = new Wurd();

instance.Wurd = Wurd;


export default instance;
