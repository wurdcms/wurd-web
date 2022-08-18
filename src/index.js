import { encodeQueryString } from './utils';

import Store from './store';
import Block from './block';


const WIDGET_URL = 'https://widget.wurd.io/widget.js';
const API_URL = 'https://api.wurd.io';


class Wurd {

  constructor(appName, options) {
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
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   * @param {Object} [options.blockHelpers]       Functions to help accessing content and creating editable regions
   * @param {Object} [options.rawContent]         Content to populate the store with
   * @param {Function} [options.markdown.parse]   Markdown parser function, e.g. marked.parse(str)
   * @param {Function} [options.markdown.parseInline] Markdown inline parser function, e.g. marked.parseInline(str)
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
      this.store.setSections(options.rawContent);
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
    const {app, store, debug} = this;

    return new Promise((resolve, reject) => {
      if (!app) {
        return reject(new Error('Use wurd.connect(appName) before wurd.load()'));
      }

      // Normalise string sectionNames to array
      if (typeof sectionNames === 'string') sectionNames = sectionNames.split(',');

      // Check for cached sections
      const cachedContent = store.getSections(sectionNames);
      const cachedSectionNames = sectionNames.filter(section => cachedContent[section] !== undefined);
      const uncachedSectionNames = sectionNames.filter(section => cachedContent[section] === undefined);

      debug && console.info('Wurd: from cache:', cachedSectionNames);

      // Return now if all content was in cache
      if (!uncachedSectionNames.length) {
        return resolve(this.content);
      }

      // Some sections not in cache; fetch them from server
      debug && console.info('Wurd: from server:', uncachedSectionNames);

      return this._fetchSections(uncachedSectionNames)
        .then(fetchedContent => {
          // Cache for next time
          store.setSections(fetchedContent);

          // Return the main Block instance for using content
          resolve(this.content);
        })
        .catch(err => reject(err));
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

    document.getElementsByTagName('body')[0].appendChild(script);
  }

  setBlockHelpers(helpers) {
    Object.assign(Block.prototype, helpers);
  }

};


const instance = new Wurd();

instance.Wurd = Wurd;


export default instance;
