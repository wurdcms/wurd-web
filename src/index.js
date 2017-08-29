import get from 'get-property-value';
import {encodeQueryString} from './utils';


const WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
const API_URL = 'https://api-v3.wurd.io';


class Wurd {

  constructor() {
    this.appName = null;
    this.options = {};

    // Object to store all content that's loaded
    this.content = {};
  }

  /**
   * Sets up the default connection/instance
   *
   * @param {String} appName
   * @param {Object} [options]
   * @param {Boolean} [options.draft]             If true, loads draft content; otherwise loads published content
   * @param {Boolean|String} [options.editMode]   Options for enabling edit mode: `true` or `'querystring'`
   */
  connect(appName, options) {
    this.appName = appName;
    this.options = Object.assign({}, options);

    // Activate edit mode if required
    switch (this.options.editMode) {
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
  }

  /**
   * Loads a section of content so that it's items are ready to be accessed with #get(id)
   *
   * @param {String} path     Section path e.g. `section`
   */
  load(path) {
    let {appName, options} = this;

    return new Promise((resolve, reject) => {
      if (!appName) {
        return reject(new Error('Use wurd.connect(appName) before wurd.load()'));
      }

      // Return cached version if available
      let sectionContent = this.content[path];

      if (sectionContent) {
        options.log && console.info('from cache: ', path);
        return resolve(sectionContent);
      }

      // No cached version; fetch from server
      options.log && console.info('from server: ', path);

      const params = encodeQueryString(options);
      const url = `${API_URL}/apps/${appName}/content/${path}?${params}`;

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
   * Gets a content item by path (e.g. `section.item`)
   *
   * @param {String} path       Item path e.g. `section.item`
   * @param {String} [backup]   Backup content to display if there is no item content
   */
  get(path, backup) {
    let {options, content} = this;

    if (options.draft) {
      backup = (typeof backup !== 'undefined') ? backup : `[${path}]`;
    }

    return get(content, path) || backup;
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
    let {appName, options} = this;

    // Draft mode is always on if in edit mode
    this.options.draft = true;

    let script = document.createElement('script');

    script.src = WIDGET_URL;
    script.async = true;
    script.setAttribute('data-app', appName);

    if (options.lang) {
      script.setAttribute('data-lang', options.lang);
    }

    document.getElementsByTagName('body')[0].appendChild(script);
  }

};


export default new Wurd();
