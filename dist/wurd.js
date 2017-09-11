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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var encodeQueryString = exports.encodeQueryString = function encodeQueryString(data) {
  var parts = Object.keys(data).map(function (key) {
    var value = data[key];

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  return parts.join('&');
};

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


var isObject = __webpack_require__(4);
var some = __webpack_require__(2);

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
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _getPropertyValue = __webpack_require__(1);

var _getPropertyValue2 = _interopRequireDefault(_getPropertyValue);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WIDGET_URL = 'https://edit-v3.wurd.io/widget.js';
var API_URL = 'https://api-v3.wurd.io';

var Wurd = function () {
  function Wurd() {
    _classCallCheck(this, Wurd);

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


  _createClass(Wurd, [{
    key: 'connect',
    value: function connect(appName) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.appName = appName;

      // Set allowed options
      ['draft', 'lang', 'debug'].forEach(function (name) {
        var val = options[name];

        if (typeof val !== 'undefined') _this[name] = val;
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

  }, {
    key: 'load',
    value: function load(path) {
      var _this2 = this;

      var appName = this.appName,
          debug = this.debug;


      return new Promise(function (resolve, reject) {
        if (!appName) {
          return reject(new Error('Use wurd.connect(appName) before wurd.load()'));
        }

        // Return cached version if available
        var sectionContent = _this2.content[path];

        if (sectionContent) {
          debug && console.info('from cache: ', path);
          return resolve(sectionContent);
        }

        // No cached version; fetch from server
        debug && console.info('from server: ', path);

        // Build request URL
        var params = ['draft', 'lang'].reduce(function (memo, param) {
          if (_this2[param]) memo[param] = _this2[param];

          return memo;
        }, {});

        var url = API_URL + '/apps/' + appName + '/content/' + path + '?' + (0, _utils.encodeQueryString)(params);

        return fetch(url).then(function (res) {
          return res.json();
        }).then(function (result) {
          if (result.error) {
            if (result.error.message) {
              throw new Error(result.error.message);
            } else {
              throw new Error('Error loading ' + path);
            }
          }

          // Cache for next time
          // TODO: Does this cause problems if future load() calls use nested paths e.g. main.subsection
          _extends(_this2.content, result);

          resolve(result);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }

    /**
     * Gets a content item by path (e.g. `section.item`).
     * Will return both text and/or objects, depending on the contents of the item
     *
     * @param {String} path       Item path e.g. `section.item`
     * @param {Mixed} [backup]    Backup content to return if there is no item content
     *
     * @return {Mixed}
     */

  }, {
    key: 'get',
    value: function get(path, backup) {
      var draft = this.draft,
          content = this.content;


      if (draft) {
        backup = typeof backup !== 'undefined' ? backup : '[' + path + ']';
      }

      return (0, _getPropertyValue2.default)(content, path) || backup;
    }

    /**
     * Gets text content of an item by path (e.g. `section.item`).
     * If the item is not a string, e.g. you have passed the path of an object,
     * an empty string will be returned, unless in editMode in which case a warning will be returned.
     *
     * @param {String} path       Item path e.g. `section.item`
     * @param {Mixed} [backup]    Backup content to return if there is no item content
     *
     * @return {Mixed}
     */

  }, {
    key: 'text',
    value: function text(path, backup) {
      var draft = this.draft,
          content = this.content;


      var text = (0, _getPropertyValue2.default)(content, path);

      if (typeof text === 'undefined') {
        if (typeof backup !== 'undefined') return backup;

        return draft ? '[' + path + ']' : '';
      }

      if (typeof text !== 'string') {
        console.warn('Tried to get object as string: ' + path);

        if (typeof backup !== 'undefined') return backup;

        return draft ? '[' + path + ']' : '';
      }

      return text;
    }

    /**
     * Invokes a function on every content item in a list.
     *
     * @param {String} path     Item path e.g. `section.item`
     * @param {Function} fn     Function to invoke
     */

  }, {
    key: 'map',
    value: function map(path, fn) {
      var content = this.content;

      // Get list content, defaulting to backup with the template

      var listContent = (0, _getPropertyValue2.default)(content, path) || _defineProperty({}, Date.now(), {});
      var index = 0;

      return Object.keys(listContent).map(function (id) {
        var item = listContent[id];
        var currentIndex = index;

        index++;

        return fn(item, [path, id].join('.'), currentIndex);
      });
    }
  }, {
    key: 'startEditor',
    value: function startEditor() {
      var appName = this.appName,
          lang = this.lang;

      // Draft mode is always on if in edit mode

      this.editMode = true;
      this.draft = true;

      var script = document.createElement('script');

      script.src = WIDGET_URL;
      script.async = true;
      script.setAttribute('data-app', appName);

      if (lang) {
        script.setAttribute('data-lang', lang);
      }

      document.getElementsByTagName('body')[0].appendChild(script);
    }
  }]);

  return Wurd;
}();

;

var instance = new Wurd();

instance.Wurd = Wurd;

exports.default = instance;
module.exports = exports['default'];

/***/ }),
/* 4 */
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