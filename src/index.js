import get from 'get-property-value';


const config = {
  widgetUrl: 'https://edit-v3.wurd.io/widget.js',
  apiUrl: 'https://api-v3.wurd.io'
};


const encodeQuerystring = function(data) {
  /*
  let parts = map(data, (value, key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });
  */

  let parts = Object.keys(data).map(key => {
    let value = data[key];

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  return parts.join('&');
};


const startEditor = function(appName, options = {}) {
  var script = document.createElement('script');

  script.src = config.widgetUrl;
  script.async = true;
  script.setAttribute('data-app', appName);

  if (options.lang) {
    script.setAttribute('data-lang', options.lang);
  }

  document.getElementsByTagName('body')[0].appendChild(script);
};


/**
 * Creates the text helper for getting text by path
 *
 * @param {Object} content
 * @param {Object} options
 *
 * @return {Function}
 */
const createTextHelper = function(content, options = {}) {
  /**
   * Gets text, falling to backup content if not defined
   *
   * @param {String} path
   * @param {String} [backup]
   */
  return function textHelper(path, backup) {
    if (options.draft) {
      backup = (typeof backup !== 'undefined') ? backup : `[${path}]`;
    }

    return get(content, path) || backup;
  };
};


/**
 * Creates the list helper for iterating over list items
 *
 * @param {Object} content
 *
 * @return {Function}
 */
const createListHelper = function(content) {
  /**
   * Runs a function for each item in a list with signature ({ item, id })
   *
   * @param {String} path
   * @param {Object|String[]} template
   * @param {Function} fn
   */
  return function listHelper(path, template, fn) {
    // Create backup content for an empty list, so that inputs are displayed
    let backup;

    // Support passing in an array of child item names as a shortcut
    if (Array.isArray(template)) {
      backup = template.reduce((memo, child) => {
        memo[child] = `[${child}]`;
        return memo;
      }, {});
    } else {
      backup = template;
    }

    // Get list content, defaulting to backup with a template
    let listContent = get(content, path);

    if (!listContent) {
      listContent = {
        '0': backup
      };
    }


    let i = 0;

    /*
    return each(listContent, (item, id) => {
      let itemWithDefaults = Object.assign({}, backup, item);

      fn(itemWithDefaults, [path, id].join('.'), i);

      i++;
    });
    */
    return Object.keys(listContent).each(id => {
      let item = listContent[id];
      let itemWithDefaults = Object.assign({}, backup, item);

      fn(itemWithDefaults, [path, id].join('.'), i);

      i++;
    });
  };
};



/**
 * Loads a given section's content
 *
 * @param {String} appName
 * @param {String} path
 * @param {Object} [options]
 * @param {Boolean} [options.draft]
 * @param {Function} cb               Callback({Error} err, {Object} content, {Function} t)
 */
const load = function(appName, path, options = {}, cb) {
  // Normalise arguments
  if (arguments.length === 3) { // appName, path, cb
    cb = options;
    options = {};
  }

  let params = encodeQuerystring(options);

  let url = `${config.apiUrl}/apps/${appName}/content/${path}?${params}`;

  fetch(url)
    .then(res => {
      if (!res.ok) return cb(new Error(`Error loading ${path}: ${res.statusText}`));

      return res.json()
        .then(content => {
          let helpers = {
            text: createTextHelper(content, options),
            list: createListHelper(content, options)
          };

          cb(null, content, helpers);
        })
        .catch(err => {
          cb(err);
        });
    })
    .catch(err => {
      cb(err);
    });
};


/**
 * Creates an client with methods bound to the app and options provided
 *
 * @param {String} appName
 * @param {Object} [options]
 * @param {Boolean} [options.draft]
 * @param {Function} cb               Callback({Error} err, {Object} content, {Function} t)
 */
const connect = function(appName, options = {}) {
  // Prevent mutating original options object
  options = Object.assign({}, options);

  // Object to store all content that's loaded
  let _allContent = {};

  const _startEditor = function() {
    // Turn draft mode on when in edit mode
    options.draft = true;

    startEditor(appName, options);
  };

  switch (options.editMode) {
    // Edit mode always on
    case true:
      _startEditor();
      break;

    // Activate edit mode if the querystring contains an 'edit' parameter e.g. '?edit'
    case 'querystring':
      if (/[?&]edit(&|$)/.test(location.search)) {
        _startEditor();
      }
      break;

    default:
      break;
  }

  return {
    load: function(path, cb = function() {}) {
      return new Promise((resolve, reject) => {
        // Return cached version if available
        if (_allContent[path]) {
          let content = _allContent[path];
          // console.info('from cache: ', path);

          resolve(content);
          cb(null, content);

          return;
        }

        // No cached version; fetch from server
        // console.info('from server: ', path);

        load(appName, path, options, (err, content) => {
          if (err) {
            reject(err);
            cb(err);
          } else {
            // Cache for next time
            // _allContent[path] = content;
            // TODO: Does this cause problems if future load() calls use nested paths e.g. main.subsection
            Object.assign(_allContent, content);

            resolve(content);
            cb(null, content);
          }
        });
      });
    },

    get: createTextHelper(_allContent, options),

    startEditor: startEditor.bind(null, appName, options)
  };
};



export default {
  connect,
  load,
  startEditor
};
