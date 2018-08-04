import {encodeQueryString} from './utils';

import Store from './store';
import Block from './block';


const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';


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
   * Loads a section of content so that it's items are ready to be accessed with #get(id)
   *
   * @param {String} path     Section path e.g. `section`
   */
  load(path) {
    let {app, store, debug} = this;

    return new Promise((resolve, reject) => {
      if (!app) {
        return reject(new Error('Use wurd.connect(appName) before wurd.load()'));
      }

      // Return cached version if available
      let sectionContent = store.get(path);

      if (sectionContent) {
        debug && console.info('from cache: ', path);
        return resolve(sectionContent);
      }

      // No cached version; fetch from server
      debug && console.info('from server: ', path);

      // Build request URL
      const params = ['draft', 'lang'].reduce((memo, param) => {
        if (this[param]) memo[param] = this[param];

        return memo;
      }, {});

      const url = `${API_URL}/apps/${app}/content/${path}?${encodeQueryString(params)}`;

      return fetch(url)
        .then(res => res.json())
        .then(result => {
          if (result.error) {
            if (result.error.message) {
              throw new Error(result.error.message);
            } else {
              throw new Error(`Error loading ${path}`);
            }
          }

          // Cache for next time
          // TODO: Does this cause problems if future load() calls use nested paths e.g. main.subsection
          store.setSections(result);

          resolve(this.content);
        })
        .catch(err => reject(err));
    });
  }

  startEditor() {
    let {app, lang} = this;

    // Draft mode is always on if in edit mode
    this.editMode = true;
    this.draft = true;

    let script = document.createElement('script');

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
