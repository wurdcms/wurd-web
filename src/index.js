import Cache from './cache';
import Store from './store';
import Block from './block';
import { getCacheId } from './utils';


const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';


class Wurd {
  constructor(appName, options) {
    this.cache = new Cache();
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
    ['draft', 'lang', 'log'].forEach(name => {
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
      this.store.set(options.rawContent);
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
      lang: this.lang,
      draft: this.draft,
      editMode: this.editMode,
      log: this.log,
    }, overrideOptions);
  }

  fetchContent(url) {
    return fetch(url)
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
      console.log(tmpOptions);

      const options = this.getOptions(tmpOptions);

      console.log(options);

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
            resolve(new Block(this, null));
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
          resolve(this.content);
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


export default instance;
