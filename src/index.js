import get from 'get-property-value';
import {encodeQueryString, replaceVars} from './utils';


const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';


class Wurd {

  constructor() {
    this.appName = null;
    this.draft = false;
    this.editMode = false;

    // Object to store all content that's loaded
    this.content = {};
  }

  /**
   * Sets up the default connection/instance
   *
   * @param {String} appName
   * @param {Object} [options]
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   */
  connect(appName, options = {}) {
    this.appName = appName;

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

    return this;
  }

  /**
   * Loads a section of content so that it's items are ready to be accessed with #get(id)
   *
   * @param {String} path     Section path e.g. `section`
   */
  load(path) {
    let {appName, debug} = this;

    return new Promise((resolve, reject) => {
      if (!appName) {
        return reject(new Error('Use wurd.connect(appName) before wurd.load()'));
      }

      // Return cached version if available
      let sectionContent = this.content[path];

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

      const url = `${API_URL}/apps/${appName}/content/${path}?${encodeQueryString(params)}`;

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
          Object.assign(this.content, result);

          resolve(result);
        })
        .catch(err => reject(err));
    });
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
    return get(this.content, path);
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
    const {draft, content} = this;

    let text = get(content, path);

    if (typeof text === 'undefined') {
      return (draft) ? `[${path}]` : '';
    }

    if (typeof text !== 'string') {
      console.warn(`Tried to get object as string: ${path}`);

      return (draft) ? `[${path}]` : '';
    }

    if (vars) {
      text = replaceVars(text, vars);
    }

    return text;
  }

  /**
   * Invokes a function on every content item in a list.
   *
   * @param {String} path     Item path e.g. `section.item`
   * @param {Function} fn     Function to invoke
   */
  map(path, fn) {
    let {content} = this;

    // Get list content, defaulting to backup with the template
    let listContent = get(content, path) || { [Date.now()]: {} };
    let index = 0;

    return Object.keys(listContent).map(id => {
      let item = listContent[id];
      let currentIndex = index;

      index++;

      return fn(item, [path, id].join('.'), currentIndex);
    });
  }

  startEditor() {
    let {appName, lang} = this;

    // Draft mode is always on if in edit mode
    this.editMode = true;
    this.draft = true;

    let script = document.createElement('script');

    script.src = WIDGET_URL;
    script.async = true;
    script.setAttribute('data-app', appName);

    if (lang) {
      script.setAttribute('data-lang', lang);
    }

    document.getElementsByTagName('body')[0].appendChild(script);
  }

};


const instance = new Wurd();

instance.Wurd = Wurd;


export default instance;
