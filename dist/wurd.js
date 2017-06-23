(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("wurd", [], factory);
	else if(typeof exports === 'object')
		exports["wurd"] = factory();
	else
		root["wurd"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/


var isObject = __webpack_require__(3);
var some = __webpack_require__(1);

module.exports = getPropertyValue;

function getPropertyValue(obj, path) {
  if (!isObject(obj) || typeof path !== 'string') {
    return obj;
  }

  var clone = obj;

  some(path.split('.'), procPath);

  return clone;

  function procPath(p) {
    clone = clone[p];
    if (!clone) {
      return true;
    }
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/


module.exports = some;

function some(arr, fn) {

  var len = arr.length;
  var i = -1;

  while (++i < len) {
    if (fn(arr[i], i, arr)) {
      return true;
    }
  }

  return false;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _getPropertyValue = __webpack_require__(0);

var _getPropertyValue2 = _interopRequireDefault(_getPropertyValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = {
  widgetUrl: 'https://edit-v3.wurd.io/widget.js',
  apiUrl: 'https://api-v3.wurd.io'
};

var encodeQuerystring = function encodeQuerystring(data) {
  /*
  let parts = map(data, (value, key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });
  */

  var parts = Object.keys(data).map(function (key) {
    var value = data[key];

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  return parts.join('&');
};

var startEditor = function startEditor(appName) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
var createTextHelper = function createTextHelper(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  /**
   * Gets text, falling to backup content if not defined
   *
   * @param {String} path
   * @param {String} [backup]
   */
  return function textHelper(path, backup) {
    if (options.draft) {
      backup = typeof backup !== 'undefined' ? backup : '[' + path + ']';
    }

    return (0, _getPropertyValue2.default)(content, path) || backup;
  };
};

/**
 * Creates the list helper for iterating over list items
 *
 * @param {Object} content
 *
 * @return {Function}
 */
var createListHelper = function createListHelper(content) {
  /**
   * Runs a function for each item in a list with signature ({ item, id })
   *
   * @param {String} path
   * @param {Object|String[]} template
   * @param {Function} fn
   */
  return function listHelper(path, template, fn) {
    // Create backup content for an empty list, so that inputs are displayed
    var backup = void 0;

    // Support passing in an array of child item names as a shortcut
    if (Array.isArray(template)) {
      backup = template.reduce(function (memo, child) {
        memo[child] = '[' + child + ']';
        return memo;
      }, {});
    } else {
      backup = template;
    }

    // Get list content, defaulting to backup with a template
    var listContent = (0, _getPropertyValue2.default)(content, path);

    if (!listContent) {
      listContent = {
        '0': backup
      };
    }

    var i = 0;

    /*
    return each(listContent, (item, id) => {
      let itemWithDefaults = Object.assign({}, backup, item);
       fn(itemWithDefaults, [path, id].join('.'), i);
       i++;
    });
    */
    return Object.keys(listContent).each(function (id) {
      var item = listContent[id];
      var itemWithDefaults = _extends({}, backup, item);

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
var _load = function _load(appName, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var cb = arguments[3];

  // Normalise arguments
  if (arguments.length === 3) {
    // appName, path, cb
    cb = options;
    options = {};
  }

  var params = encodeQuerystring(options);

  var url = config.apiUrl + '/apps/' + appName + '/content/' + path + '?' + params;

  fetch(url).then(function (res) {
    if (!res.ok) return cb(new Error('Error loading ' + path + ': ' + res.statusText));

    return res.json().then(function (content) {
      var helpers = {
        text: createTextHelper(content, options),
        list: createListHelper(content, options)
      };

      cb(null, content, helpers);
    }).catch(function (err) {
      cb(err);
    });
  }).catch(function (err) {
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
var connect = function connect(appName) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Prevent mutating original options object
  options = _extends({}, options);

  // Object to store all content that's loaded
  var _allContent = {};

  var _startEditor = function _startEditor() {
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
    load: function load(path) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      return new Promise(function (resolve, reject) {
        // Return cached version if available
        if (_allContent[path]) {
          var content = _allContent[path];
          // console.info('from cache: ', path);

          resolve(content);
          cb(null, content);

          return;
        }

        // No cached version; fetch from server
        // console.info('from server: ', path);

        _load(appName, path, options, function (err, content) {
          if (err) {
            reject(err);
            cb(err);
          } else {
            // Cache for next time
            // _allContent[path] = content;
            // TODO: Does this cause problems if future load() calls use nested paths e.g. main.subsection
            _extends(_allContent, content);

            resolve(content);
            cb(null, content);
          }
        });
      });
    },

    get: createTextHelper(_allContent, options),

    map: function map(path, fn) {
      // Get list content, defaulting to backup with the template
      var listContent = (0, _getPropertyValue2.default)(_allContent, path) || _defineProperty({}, Date.now(), {});
      var index = 0;

      return Object.keys(listContent).map(function (id) {
        var item = listContent[id];
        var currentIndex = index;

        index++;

        return fn(item, [path, id].join('.'), currentIndex);
      });
    },

    startEditor: startEditor.bind(null, appName, options)
  };
};

exports.default = {
  connect: connect,
  load: _load,
  startEditor: startEditor
};
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = isObject;

function isObject(val) {
  return !(val == null || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object' || Array.isArray(val));
}

/***/ })
/******/ ]);
});