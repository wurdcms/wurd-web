(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wurd = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * @param {Object} data
   *
   * @return {String}
   */
  function encodeQueryString(data) {
    var parts = Object.keys(data).map(function (key) {
      var value = data[key];
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

  function replaceVars(text) {
    var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (typeof text !== 'string') return text;
    return text.replace(/{{([\w.-]+)}}/g, function (_, key) {
      return vars[key] || '';
    });
  }

  var Store = /*#__PURE__*/function () {
    /**
     * @param {Object} rawContent       Initial content
     */
    function Store() {
      var rawContent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Store);

      this.rawContent = rawContent;
    }
    /**
     * Get a specific piece of content, top-level or nested
     *
     * @param {String} path e.g. 'section','section.subSection','a.b.c.d'
     * @return {Mixed}
     */


    _createClass(Store, [{
      key: "get",
      value: function get(path) {
        if (!path) return this.rawContent;
        return path.split('.').reduce(function (acc, k) {
          return acc && acc[k];
        }, this.rawContent);
      }
      /**
       * Load top-level sections of content
       *
       * @param {String[]} sectionNames
       * @return {Object}
       */

    }, {
      key: "getSections",
      value: function getSections(sectionNames) {
        var _this = this;

        var entries = sectionNames.map(function (key) {
          return [key, _this.rawContent[key]];
        });
        return Object.fromEntries(entries);
      }
      /**
       * Save top-levle sections of content
       *
       * @param {Object} sections       Top level sections of content
       */

    }, {
      key: "setSections",
      value: function setSections(sections) {
        Object.assign(this.rawContent, sections);
      }
    }]);

    return Store;
  }();

  var defaults$5 = {exports: {}};

  function getDefaults$1() {
    return {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: null,
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tokenizer: null,
      walkTokens: null,
      xhtml: false
    };
  }

  function changeDefaults$1(newDefaults) {
    defaults$5.exports.defaults = newDefaults;
  }

  defaults$5.exports = {
    defaults: getDefaults$1(),
    getDefaults: getDefaults$1,
    changeDefaults: changeDefaults$1
  };

  /**
   * Helpers
   */
  var escapeTest = /[&<>"']/;
  var escapeReplace = /[&<>"']/g;
  var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
  var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  var escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  var getEscapeReplacement = function getEscapeReplacement(ch) {
    return escapeReplacements[ch];
  };

  function escape$2(html, encode) {
    if (encode) {
      if (escapeTest.test(html)) {
        return html.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html)) {
        return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }

    return html;
  }

  var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

  function unescape$1(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(unescapeTest, function (_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';

      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }

      return '';
    });
  }

  var caret = /(^|[^\[])\^/g;

  function edit$1(regex, opt) {
    regex = regex.source || regex;
    opt = opt || '';
    var obj = {
      replace: function replace(name, val) {
        val = val.source || val;
        val = val.replace(caret, '$1');
        regex = regex.replace(name, val);
        return obj;
      },
      getRegex: function getRegex() {
        return new RegExp(regex, opt);
      }
    };
    return obj;
  }

  var nonWordAndColonTest = /[^\w:]/g;
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  function cleanUrl$1(sanitize, base, href) {
    if (sanitize) {
      var prot;

      try {
        prot = decodeURIComponent(unescape$1(href)).replace(nonWordAndColonTest, '').toLowerCase();
      } catch (e) {
        return null;
      }

      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return null;
      }
    }

    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }

    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return null;
    }

    return href;
  }

  var baseUrls = {};
  var justDomain = /^[^:]+:\/*[^/]*$/;
  var protocol = /^([^:]+:)[\s\S]*$/;
  var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (justDomain.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = rtrim$1(base, '/', true);
      }
    }

    base = baseUrls[' ' + base];
    var relativeBase = base.indexOf(':') === -1;

    if (href.substring(0, 2) === '//') {
      if (relativeBase) {
        return href;
      }

      return base.replace(protocol, '$1') + href;
    } else if (href.charAt(0) === '/') {
      if (relativeBase) {
        return href;
      }

      return base.replace(domain, '$1') + href;
    } else {
      return base + href;
    }
  }

  var noopTest$1 = {
    exec: function noopTest() {}
  };

  function merge$2(obj) {
    var i = 1,
        target,
        key;

    for (; i < arguments.length; i++) {
      target = arguments[i];

      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  function splitCells$1(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    var row = tableRow.replace(/\|/g, function (match, offset, str) {
      var escaped = false,
          curr = offset;

      while (--curr >= 0 && str[curr] === '\\') {
        escaped = !escaped;
      }

      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
        cells = row.split(/ \|/);
    var i = 0;

    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) {
        cells.push('');
      }
    }

    for (; i < cells.length; i++) {
      // leading or trailing whitespace is ignored per the gfm spec
      cells[i] = cells[i].trim().replace(/\\\|/g, '|');
    }

    return cells;
  } // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
  // /c*$/ is vulnerable to REDOS.
  // invert: Remove suffix of non-c chars instead. Default falsey.


  function rtrim$1(str, c, invert) {
    var l = str.length;

    if (l === 0) {
      return '';
    } // Length of suffix matching the invert condition.


    var suffLen = 0; // Step left until we fail to match the invert condition.

    while (suffLen < l) {
      var currChar = str.charAt(l - suffLen - 1);

      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }

    return str.substr(0, l - suffLen);
  }

  function findClosingBracket$1(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }

    var l = str.length;
    var level = 0,
        i = 0;

    for (; i < l; i++) {
      if (str[i] === '\\') {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;

        if (level < 0) {
          return i;
        }
      }
    }

    return -1;
  }

  function checkSanitizeDeprecation$1(opt) {
    if (opt && opt.sanitize && !opt.silent) {
      console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
    }
  } // copied from https://stackoverflow.com/a/5450113/806777


  function repeatString$1(pattern, count) {
    if (count < 1) {
      return '';
    }

    var result = '';

    while (count > 1) {
      if (count & 1) {
        result += pattern;
      }

      count >>= 1;
      pattern += pattern;
    }

    return result + pattern;
  }

  var helpers = {
    escape: escape$2,
    unescape: unescape$1,
    edit: edit$1,
    cleanUrl: cleanUrl$1,
    resolveUrl: resolveUrl,
    noopTest: noopTest$1,
    merge: merge$2,
    splitCells: splitCells$1,
    rtrim: rtrim$1,
    findClosingBracket: findClosingBracket$1,
    checkSanitizeDeprecation: checkSanitizeDeprecation$1,
    repeatString: repeatString$1
  };

  var defaults$4 = defaults$5.exports.defaults;
  var rtrim = helpers.rtrim,
      splitCells = helpers.splitCells,
      _escape = helpers.escape,
      findClosingBracket = helpers.findClosingBracket;

  function outputLink(cap, link, raw) {
    var href = link.href;
    var title = link.title ? _escape(link.title) : null;
    var text = cap[1].replace(/\\([\[\]])/g, '$1');

    if (cap[0].charAt(0) !== '!') {
      return {
        type: 'link',
        raw: raw,
        href: href,
        title: title,
        text: text
      };
    } else {
      return {
        type: 'image',
        raw: raw,
        href: href,
        title: title,
        text: _escape(text)
      };
    }
  }

  function indentCodeCompensation(raw, text) {
    var matchIndentToCode = raw.match(/^(\s+)(?:```)/);

    if (matchIndentToCode === null) {
      return text;
    }

    var indentToCode = matchIndentToCode[1];
    return text.split('\n').map(function (node) {
      var matchIndentInNode = node.match(/^\s+/);

      if (matchIndentInNode === null) {
        return node;
      }

      var _matchIndentInNode = _slicedToArray(matchIndentInNode, 1),
          indentInNode = _matchIndentInNode[0];

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    }).join('\n');
  }
  /**
   * Tokenizer
   */


  var Tokenizer_1 = /*#__PURE__*/function () {
    function Tokenizer(options) {
      _classCallCheck(this, Tokenizer);

      this.options = options || defaults$4;
    }

    _createClass(Tokenizer, [{
      key: "space",
      value: function space(src) {
        var cap = this.rules.block.newline.exec(src);

        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: 'space',
              raw: cap[0]
            };
          }

          return {
            raw: '\n'
          };
        }
      }
    }, {
      key: "code",
      value: function code(src, tokens) {
        var cap = this.rules.block.code.exec(src);

        if (cap) {
          var lastToken = tokens[tokens.length - 1]; // An indented code block cannot interrupt a paragraph.

          if (lastToken && lastToken.type === 'paragraph') {
            return {
              raw: cap[0],
              text: cap[0].trimRight()
            };
          }

          var text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic ? rtrim(text, '\n') : text
          };
        }
      }
    }, {
      key: "fences",
      value: function fences(src) {
        var cap = this.rules.block.fences.exec(src);

        if (cap) {
          var raw = cap[0];
          var text = indentCodeCompensation(raw, cap[3] || '');
          return {
            type: 'code',
            raw: raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text: text
          };
        }
      }
    }, {
      key: "heading",
      value: function heading(src) {
        var cap = this.rules.block.heading.exec(src);

        if (cap) {
          var text = cap[2].trim(); // remove trailing #s

          if (/#$/.test(text)) {
            var trimmed = rtrim(text, '#');

            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          return {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text: text
          };
        }
      }
    }, {
      key: "nptable",
      value: function nptable(src) {
        var cap = this.rules.block.nptable.exec(src);

        if (cap) {
          var item = {
            type: 'table',
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
            raw: cap[0]
          };

          if (item.header.length === item.align.length) {
            var l = item.align.length;
            var i;

            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.cells.length;

            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(item.cells[i], item.header.length);
            }

            return item;
          }
        }
      }
    }, {
      key: "hr",
      value: function hr(src) {
        var cap = this.rules.block.hr.exec(src);

        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }
    }, {
      key: "blockquote",
      value: function blockquote(src) {
        var cap = this.rules.block.blockquote.exec(src);

        if (cap) {
          var text = cap[0].replace(/^ *> ?/gm, '');
          return {
            type: 'blockquote',
            raw: cap[0],
            text: text
          };
        }
      }
    }, {
      key: "list",
      value: function list(src) {
        var cap = this.rules.block.list.exec(src);

        if (cap) {
          var raw = cap[0];
          var bull = cap[2];
          var isordered = bull.length > 1;
          var list = {
            type: 'list',
            raw: raw,
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          }; // Get each top-level item.

          var itemMatch = cap[0].match(this.rules.block.item);
          var next = false,
              item,
              space,
              bcurr,
              bnext,
              addBack,
              loose,
              istask,
              ischecked;
          var l = itemMatch.length;
          bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);

          for (var i = 0; i < l; i++) {
            item = itemMatch[i];
            raw = item; // Determine whether the next list item belongs here.
            // Backpedal if it does not belong in this list.

            if (i !== l - 1) {
              bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);

              if (!this.options.pedantic ? bnext[1].length > bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
                // nested list
                itemMatch.splice(i, 2, itemMatch[i] + '\n' + itemMatch[i + 1]);
                i--;
                l--;
                continue;
              } else {
                if ( // different bullet style
                !this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
                  addBack = itemMatch.slice(i + 1).join('\n');
                  list.raw = list.raw.substring(0, list.raw.length - addBack.length);
                  i = l - 1;
                }
              }

              bcurr = bnext;
            } // Remove the list item's bullet
            // so it is seen as the next token.


            space = item.length;
            item = item.replace(/^ *([*+-]|\d+[.)]) ?/, ''); // Outdent whatever the
            // list item contains. Hacky.

            if (~item.indexOf('\n ')) {
              space -= item.length;
              item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
            } // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.


            loose = next || /\n\n(?!\s*$)/.test(item);

            if (i !== l - 1) {
              next = item.charAt(item.length - 1) === '\n';
              if (!loose) loose = next;
            }

            if (loose) {
              list.loose = true;
            } // Check for task list items


            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.test(item);
              ischecked = undefined;

              if (istask) {
                ischecked = item[1] !== ' ';
                item = item.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw: raw,
              task: istask,
              checked: ischecked,
              loose: loose,
              text: item
            });
          }

          return list;
        }
      }
    }, {
      key: "html",
      value: function html(src) {
        var cap = this.rules.block.html.exec(src);

        if (cap) {
          return {
            type: this.options.sanitize ? 'paragraph' : 'html',
            raw: cap[0],
            pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
          };
        }
      }
    }, {
      key: "def",
      value: function def(src) {
        var cap = this.rules.block.def.exec(src);

        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          var tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            tag: tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }
    }, {
      key: "table",
      value: function table(src) {
        var cap = this.rules.block.table.exec(src);

        if (cap) {
          var item = {
            type: 'table',
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];
            var l = item.align.length;
            var i;

            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.cells.length;

            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ''), item.header.length);
            }

            return item;
          }
        }
      }
    }, {
      key: "lheading",
      value: function lheading(src) {
        var cap = this.rules.block.lheading.exec(src);

        if (cap) {
          return {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1]
          };
        }
      }
    }, {
      key: "paragraph",
      value: function paragraph(src) {
        var cap = this.rules.block.paragraph.exec(src);

        if (cap) {
          return {
            type: 'paragraph',
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
          };
        }
      }
    }, {
      key: "text",
      value: function text(src, tokens) {
        var cap = this.rules.block.text.exec(src);

        if (cap) {
          var lastToken = tokens[tokens.length - 1];

          if (lastToken && lastToken.type === 'text') {
            return {
              raw: cap[0],
              text: cap[0]
            };
          }

          return {
            type: 'text',
            raw: cap[0],
            text: cap[0]
          };
        }
      }
    }, {
      key: "escape",
      value: function escape(src) {
        var cap = this.rules.inline.escape.exec(src);

        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: _escape(cap[1])
          };
        }
      }
    }, {
      key: "tag",
      value: function tag(src, inLink, inRawBlock) {
        var cap = this.rules.inline.tag.exec(src);

        if (cap) {
          if (!inLink && /^<a /i.test(cap[0])) {
            inLink = true;
          } else if (inLink && /^<\/a>/i.test(cap[0])) {
            inLink = false;
          }

          if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = true;
          } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = false;
          }

          return {
            type: this.options.sanitize ? 'text' : 'html',
            raw: cap[0],
            inLink: inLink,
            inRawBlock: inRawBlock,
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
          };
        }
      }
    }, {
      key: "link",
      value: function link(src) {
        var cap = this.rules.inline.link.exec(src);

        if (cap) {
          var trimmedUrl = cap[2].trim();

          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!/>$/.test(trimmedUrl)) {
              return;
            } // ending angle bracket cannot be escaped


            var rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');

            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            var lastParenIndex = findClosingBracket(cap[2], '()');

            if (lastParenIndex > -1) {
              var start = cap[0].indexOf('!') === 0 ? 5 : 4;
              var linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }

          var href = cap[2];
          var title = '';

          if (this.options.pedantic) {
            // split pedantic href and title
            var link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();

          if (/^</.test(href)) {
            if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }

          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0]);
        }
      }
    }, {
      key: "reflink",
      value: function reflink(src, links) {
        var cap;

        if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
          var link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];

          if (!link || !link.href) {
            var text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text: text
            };
          }

          return outputLink(cap, link, cap[0]);
        }
      }
    }, {
      key: "strong",
      value: function strong(src, maskedSrc) {
        var prevChar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var match = this.rules.inline.strong.start.exec(src);

        if (match && (!match[1] || match[1] && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          maskedSrc = maskedSrc.slice(-1 * src.length);
          var endReg = match[0] === '**' ? this.rules.inline.strong.endAst : this.rules.inline.strong.endUnd;
          endReg.lastIndex = 0;
          var cap;

          while ((match = endReg.exec(maskedSrc)) != null) {
            cap = this.rules.inline.strong.middle.exec(maskedSrc.slice(0, match.index + 3));

            if (cap) {
              return {
                type: 'strong',
                raw: src.slice(0, cap[0].length),
                text: src.slice(2, cap[0].length - 2)
              };
            }
          }
        }
      }
    }, {
      key: "em",
      value: function em(src, maskedSrc) {
        var prevChar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var match = this.rules.inline.em.start.exec(src);

        if (match && (!match[1] || match[1] && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          maskedSrc = maskedSrc.slice(-1 * src.length);
          var endReg = match[0] === '*' ? this.rules.inline.em.endAst : this.rules.inline.em.endUnd;
          endReg.lastIndex = 0;
          var cap;

          while ((match = endReg.exec(maskedSrc)) != null) {
            cap = this.rules.inline.em.middle.exec(maskedSrc.slice(0, match.index + 2));

            if (cap) {
              return {
                type: 'em',
                raw: src.slice(0, cap[0].length),
                text: src.slice(1, cap[0].length - 1)
              };
            }
          }
        }
      }
    }, {
      key: "codespan",
      value: function codespan(src) {
        var cap = this.rules.inline.code.exec(src);

        if (cap) {
          var text = cap[2].replace(/\n/g, ' ');
          var hasNonSpaceChars = /[^ ]/.test(text);
          var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);

          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }

          text = _escape(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text: text
          };
        }
      }
    }, {
      key: "br",
      value: function br(src) {
        var cap = this.rules.inline.br.exec(src);

        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }
    }, {
      key: "del",
      value: function del(src) {
        var cap = this.rules.inline.del.exec(src);

        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2]
          };
        }
      }
    }, {
      key: "autolink",
      value: function autolink(src, mangle) {
        var cap = this.rules.inline.autolink.exec(src);

        if (cap) {
          var text, href;

          if (cap[2] === '@') {
            text = _escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = _escape(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text: text,
            href: href,
            tokens: [{
              type: 'text',
              raw: text,
              text: text
            }]
          };
        }
      }
    }, {
      key: "url",
      value: function url(src, mangle) {
        var cap;

        if (cap = this.rules.inline.url.exec(src)) {
          var text, href;

          if (cap[2] === '@') {
            text = _escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            var prevCapZero;

            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);

            text = _escape(cap[0]);

            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }

          return {
            type: 'link',
            raw: cap[0],
            text: text,
            href: href,
            tokens: [{
              type: 'text',
              raw: text,
              text: text
            }]
          };
        }
      }
    }, {
      key: "inlineText",
      value: function inlineText(src, inRawBlock, smartypants) {
        var cap = this.rules.inline.text.exec(src);

        if (cap) {
          var text;

          if (inRawBlock) {
            text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0];
          } else {
            text = _escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }

          return {
            type: 'text',
            raw: cap[0],
            text: text
          };
        }
      }
    }]);

    return Tokenizer;
  }();

  var noopTest = helpers.noopTest,
      edit = helpers.edit,
      merge$1 = helpers.merge;
  /**
   * Block-Level Grammar
   */

  var block$1 = {
    newline: /^(?: *(?:\n|$))+/,
    code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
    fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
    html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
    + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    nptable: noopTest,
    table: noopTest,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    // regex template, placeholders will be replaced according to different paragraph
    // interruption rules of commonmark and the original markdown spec:
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
    text: /^[^\n]+/
  };
  block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block$1.def = edit(block$1.def).replace('label', block$1._label).replace('title', block$1._title).getRegex();
  block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
  block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
  block$1.item = edit(block$1.item, 'gm').replace(/bull/g, block$1.bullet).getRegex();
  block$1.listItemStart = edit(/^( *)(bull)/).replace('bull', block$1.bullet).getRegex();
  block$1.list = edit(block$1.list).replace(/bull/g, block$1.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block$1.def.source + ')').getRegex();
  block$1._tag = 'address|article|aside|base|basefont|blockquote|body|caption' + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' + '|track|ul';
  block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
  block$1.html = edit(block$1.html, 'i').replace('comment', block$1._comment).replace('tag', block$1._tag).replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  block$1.paragraph = edit(block$1._paragraph).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();
  block$1.blockquote = edit(block$1.blockquote).replace('paragraph', block$1.paragraph).getRegex();
  /**
   * Normal Block Grammar
   */

  block$1.normal = merge$1({}, block$1);
  /**
   * GFM Block Grammar
   */

  block$1.gfm = merge$1({}, block$1.normal, {
    nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
    + ' {0,3}([-:]+ *\\|[-| :]*)' // Align
    + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
    // Cells
    table: '^ *\\|(.+)\\n' // Header
    + ' {0,3}\\|?( *[-:]+[-| :]*)' // Align
    + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells

  });
  block$1.gfm.nptable = edit(block$1.gfm.nptable).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();
  block$1.gfm.table = edit(block$1.gfm.table).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();
  /**
   * Pedantic grammar (original John Gruber's loose markdown specification)
   */

  block$1.pedantic = merge$1({}, block$1.normal, {
    html: edit('^ *(?:comment *(?:\\n|\\s*$)' + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').replace('comment', block$1._comment).replace(/tag/g, '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    paragraph: edit(block$1.normal._paragraph).replace('hr', block$1.hr).replace('heading', ' *#{1,6} *[^\n]').replace('lheading', block$1.lheading).replace('blockquote', ' {0,3}>').replace('|fences', '').replace('|list', '').replace('|html', '').getRegex()
  });
  /**
   * Inline-Level Grammar
   */

  var inline$1 = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest,
    tag: '^comment' + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
    // CDATA section
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    reflinkSearch: 'reflink|nolink(?!\\()',
    strong: {
      start: /^(?:(\*\*(?=[*punctuation]))|\*\*)(?![\s])|__/,
      // (1) returns if starts w/ punctuation
      middle: /^\*\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*\*$|^__(?![\s])((?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?)__$/,
      endAst: /[^punctuation\s]\*\*(?!\*)|[punctuation]\*\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      // last char can't be punct, or final * must also be followed by punct (or endline)
      endUnd: /[^\s]__(?!_)(?:(?=[punctuation*\s])|$)/ // last char can't be a space, and final _ must preceed punct or \s (or endline)

    },
    em: {
      start: /^(?:(\*(?=[punctuation]))|\*)(?![*\s])|_/,
      // (1) returns if starts w/ punctuation
      middle: /^\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*$|^_(?![_\s])(?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?_$/,
      endAst: /[^punctuation\s]\*(?!\*)|[punctuation]\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      // last char can't be punct, or final * must also be followed by punct (or endline)
      endUnd: /[^\s]_(?!_)(?:(?=[punctuation*\s])|$)/ // last char can't be a space, and final _ must preceed punct or \s (or endline)

    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noopTest,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\s*punctuation])/
  }; // list of punctuation marks from common mark spec
  // without * and _ to workaround cases with double emphasis

  inline$1._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
  inline$1.punctuation = edit(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex(); // sequences em should skip over [title](link), `code`, <html>

  inline$1._blockSkip = '\\[[^\\]]*?\\]\\([^\\)]*?\\)|`[^`]*?`|<[^>]*?>';
  inline$1._overlapSkip = '__[^_]*?__|\\*\\*\\[^\\*\\]*?\\*\\*';
  inline$1._comment = edit(block$1._comment).replace('(?:-->|$)', '-->').getRegex();
  inline$1.em.start = edit(inline$1.em.start).replace(/punctuation/g, inline$1._punctuation).getRegex();
  inline$1.em.middle = edit(inline$1.em.middle).replace(/punctuation/g, inline$1._punctuation).replace(/overlapSkip/g, inline$1._overlapSkip).getRegex();
  inline$1.em.endAst = edit(inline$1.em.endAst, 'g').replace(/punctuation/g, inline$1._punctuation).getRegex();
  inline$1.em.endUnd = edit(inline$1.em.endUnd, 'g').replace(/punctuation/g, inline$1._punctuation).getRegex();
  inline$1.strong.start = edit(inline$1.strong.start).replace(/punctuation/g, inline$1._punctuation).getRegex();
  inline$1.strong.middle = edit(inline$1.strong.middle).replace(/punctuation/g, inline$1._punctuation).replace(/overlapSkip/g, inline$1._overlapSkip).getRegex();
  inline$1.strong.endAst = edit(inline$1.strong.endAst, 'g').replace(/punctuation/g, inline$1._punctuation).getRegex();
  inline$1.strong.endUnd = edit(inline$1.strong.endUnd, 'g').replace(/punctuation/g, inline$1._punctuation).getRegex();
  inline$1.blockSkip = edit(inline$1._blockSkip, 'g').getRegex();
  inline$1.overlapSkip = edit(inline$1._overlapSkip, 'g').getRegex();
  inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
  inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline$1.autolink = edit(inline$1.autolink).replace('scheme', inline$1._scheme).replace('email', inline$1._email).getRegex();
  inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
  inline$1.tag = edit(inline$1.tag).replace('comment', inline$1._comment).replace('attribute', inline$1._attribute).getRegex();
  inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
  inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
  inline$1.link = edit(inline$1.link).replace('label', inline$1._label).replace('href', inline$1._href).replace('title', inline$1._title).getRegex();
  inline$1.reflink = edit(inline$1.reflink).replace('label', inline$1._label).getRegex();
  inline$1.reflinkSearch = edit(inline$1.reflinkSearch, 'g').replace('reflink', inline$1.reflink).replace('nolink', inline$1.nolink).getRegex();
  /**
   * Normal Inline Grammar
   */

  inline$1.normal = merge$1({}, inline$1);
  /**
   * Pedantic Inline Grammar
   */

  inline$1.pedantic = merge$1({}, inline$1.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace('label', inline$1._label).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace('label', inline$1._label).getRegex()
  });
  /**
   * GFM Inline Grammar
   */

  inline$1.gfm = merge$1({}, inline$1.normal, {
    escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
  });
  inline$1.gfm.url = edit(inline$1.gfm.url, 'i').replace('email', inline$1.gfm._extended_email).getRegex();
  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline$1.breaks = merge$1({}, inline$1.gfm, {
    br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
    text: edit(inline$1.gfm.text).replace('\\b_', '\\b_| {2,}\\n').replace(/\{2,\}/g, '*').getRegex()
  });
  var rules = {
    block: block$1,
    inline: inline$1
  };

  var Tokenizer$1 = Tokenizer_1;
  var defaults$3 = defaults$5.exports.defaults;
  var block = rules.block,
      inline = rules.inline;
  var repeatString = helpers.repeatString;
  /**
   * smartypants text replacement
   */

  function smartypants(text) {
    return text // em-dashes
    .replace(/---/g, "\u2014") // en-dashes
    .replace(/--/g, "\u2013") // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018") // closing singles & apostrophes
    .replace(/'/g, "\u2019") // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C") // closing doubles
    .replace(/"/g, "\u201D") // ellipses
    .replace(/\.{3}/g, "\u2026");
  }
  /**
   * mangle email addresses
   */


  function mangle(text) {
    var out = '',
        i,
        ch;
    var l = text.length;

    for (i = 0; i < l; i++) {
      ch = text.charCodeAt(i);

      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }

      out += '&#' + ch + ';';
    }

    return out;
  }
  /**
   * Block Lexer
   */


  var Lexer_1 = /*#__PURE__*/function () {
    function Lexer(options) {
      _classCallCheck(this, Lexer);

      this.tokens = [];
      this.tokens.links = Object.create(null);
      this.options = options || defaults$3;
      this.options.tokenizer = this.options.tokenizer || new Tokenizer$1();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      var rules = {
        block: block.normal,
        inline: inline.normal
      };

      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;

        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }

      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */


    _createClass(Lexer, [{
      key: "lex",
      value:
      /**
       * Preprocessing
       */
      function lex(src) {
        src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
        this.blockTokens(src, this.tokens, true);
        this.inline(this.tokens);
        return this.tokens;
      }
      /**
       * Lexing
       */

    }, {
      key: "blockTokens",
      value: function blockTokens(src) {
        var tokens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (this.options.pedantic) {
          src = src.replace(/^ +$/gm, '');
        }

        var token, i, l, lastToken;

        while (src) {
          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);

            if (token.type) {
              tokens.push(token);
            }

            continue;
          } // code


          if (token = this.tokenizer.code(src, tokens)) {
            src = src.substring(token.raw.length);

            if (token.type) {
              tokens.push(token);
            } else {
              lastToken = tokens[tokens.length - 1];
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
            }

            continue;
          } // fences


          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // heading


          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // table no leading pipe (gfm)


          if (token = this.tokenizer.nptable(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // hr


          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // blockquote


          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.blockTokens(token.text, [], top);
            tokens.push(token);
            continue;
          } // list


          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            l = token.items.length;

            for (i = 0; i < l; i++) {
              token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
            }

            tokens.push(token);
            continue;
          } // html


          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // def


          if (top && (token = this.tokenizer.def(src))) {
            src = src.substring(token.raw.length);

            if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }

            continue;
          } // table (gfm)


          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // lheading


          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // top-level paragraph


          if (top && (token = this.tokenizer.paragraph(src))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // text


          if (token = this.tokenizer.text(src, tokens)) {
            src = src.substring(token.raw.length);

            if (token.type) {
              tokens.push(token);
            } else {
              lastToken = tokens[tokens.length - 1];
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
            }

            continue;
          }

          if (src) {
            var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }, {
      key: "inline",
      value: function inline(tokens) {
        var i, j, k, l2, row, token;
        var l = tokens.length;

        for (i = 0; i < l; i++) {
          token = tokens[i];

          switch (token.type) {
            case 'paragraph':
            case 'text':
            case 'heading':
              {
                token.tokens = [];
                this.inlineTokens(token.text, token.tokens);
                break;
              }

            case 'table':
              {
                token.tokens = {
                  header: [],
                  cells: []
                }; // header

                l2 = token.header.length;

                for (j = 0; j < l2; j++) {
                  token.tokens.header[j] = [];
                  this.inlineTokens(token.header[j], token.tokens.header[j]);
                } // cells


                l2 = token.cells.length;

                for (j = 0; j < l2; j++) {
                  row = token.cells[j];
                  token.tokens.cells[j] = [];

                  for (k = 0; k < row.length; k++) {
                    token.tokens.cells[j][k] = [];
                    this.inlineTokens(row[k], token.tokens.cells[j][k]);
                  }
                }

                break;
              }

            case 'blockquote':
              {
                this.inline(token.tokens);
                break;
              }

            case 'list':
              {
                l2 = token.items.length;

                for (j = 0; j < l2; j++) {
                  this.inline(token.items[j].tokens);
                }

                break;
              }
          }
        }

        return tokens;
      }
      /**
       * Lexing/Compiling
       */

    }, {
      key: "inlineTokens",
      value: function inlineTokens(src) {
        var tokens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var inLink = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var inRawBlock = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var token; // String with links masked to avoid interference with em and strong

        var maskedSrc = src;
        var match;
        var keepPrevChar, prevChar; // Mask out reflinks

        if (this.tokens.links) {
          var links = Object.keys(this.tokens.links);

          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        } // Mask out other blocks


        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }

          keepPrevChar = false; // escape

          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // tag


          if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
            src = src.substring(token.raw.length);
            inLink = token.inLink;
            inRawBlock = token.inRawBlock;
            tokens.push(token);
            continue;
          } // link


          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);

            if (token.type === 'link') {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
            }

            tokens.push(token);
            continue;
          } // reflink, nolink


          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);

            if (token.type === 'link') {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
            }

            tokens.push(token);
            continue;
          } // strong


          if (token = this.tokenizer.strong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          } // em


          if (token = this.tokenizer.em(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          } // code


          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // br


          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // del (gfm)


          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          } // autolink


          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // url (gfm)


          if (!inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          } // text


          if (token = this.tokenizer.inlineText(src, inRawBlock, smartypants)) {
            src = src.substring(token.raw.length);
            prevChar = token.raw.slice(-1);
            keepPrevChar = true;
            tokens.push(token);
            continue;
          }

          if (src) {
            var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }], [{
      key: "rules",
      get: function get() {
        return {
          block: block,
          inline: inline
        };
      }
      /**
       * Static Lex Method
       */

    }, {
      key: "lex",
      value: function lex(src, options) {
        var lexer = new Lexer(options);
        return lexer.lex(src);
      }
      /**
       * Static Lex Inline Method
       */

    }, {
      key: "lexInline",
      value: function lexInline(src, options) {
        var lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }
    }]);

    return Lexer;
  }();

  var defaults$2 = defaults$5.exports.defaults;
  var cleanUrl = helpers.cleanUrl,
      escape$1 = helpers.escape;
  /**
   * Renderer
   */

  var Renderer_1 = /*#__PURE__*/function () {
    function Renderer(options) {
      _classCallCheck(this, Renderer);

      this.options = options || defaults$2;
    }

    _createClass(Renderer, [{
      key: "code",
      value: function code(_code, infostring, escaped) {
        var lang = (infostring || '').match(/\S*/)[0];

        if (this.options.highlight) {
          var out = this.options.highlight(_code, lang);

          if (out != null && out !== _code) {
            escaped = true;
            _code = out;
          }
        }

        _code = _code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
        }

        return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
      }
    }, {
      key: "blockquote",
      value: function blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      }
    }, {
      key: "html",
      value: function html(_html) {
        return _html;
      }
    }, {
      key: "heading",
      value: function heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return '<h' + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + '</h' + level + '>\n';
        } // ignore IDs


        return '<h' + level + '>' + text + '</h' + level + '>\n';
      }
    }, {
      key: "hr",
      value: function hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }
    }, {
      key: "list",
      value: function list(body, ordered, start) {
        var type = ordered ? 'ol' : 'ul',
            startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }
    }, {
      key: "listitem",
      value: function listitem(text) {
        return '<li>' + text + '</li>\n';
      }
    }, {
      key: "checkbox",
      value: function checkbox(checked) {
        return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
      }
    }, {
      key: "paragraph",
      value: function paragraph(text) {
        return '<p>' + text + '</p>\n';
      }
    }, {
      key: "table",
      value: function table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';
        return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
      }
    }, {
      key: "tablerow",
      value: function tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      }
    }, {
      key: "tablecell",
      value: function tablecell(content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      } // span level renderer

    }, {
      key: "strong",
      value: function strong(text) {
        return '<strong>' + text + '</strong>';
      }
    }, {
      key: "em",
      value: function em(text) {
        return '<em>' + text + '</em>';
      }
    }, {
      key: "codespan",
      value: function codespan(text) {
        return '<code>' + text + '</code>';
      }
    }, {
      key: "br",
      value: function br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }
    }, {
      key: "del",
      value: function del(text) {
        return '<del>' + text + '</del>';
      }
    }, {
      key: "link",
      value: function link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

        if (href === null) {
          return text;
        }

        var out = '<a href="' + escape$1(href) + '"';

        if (title) {
          out += ' title="' + title + '"';
        }

        out += '>' + text + '</a>';
        return out;
      }
    }, {
      key: "image",
      value: function image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

        if (href === null) {
          return text;
        }

        var out = '<img src="' + href + '" alt="' + text + '"';

        if (title) {
          out += ' title="' + title + '"';
        }

        out += this.options.xhtml ? '/>' : '>';
        return out;
      }
    }, {
      key: "text",
      value: function text(_text) {
        return _text;
      }
    }]);

    return Renderer;
  }();

  var TextRenderer_1 = /*#__PURE__*/function () {
    function TextRenderer() {
      _classCallCheck(this, TextRenderer);
    }

    _createClass(TextRenderer, [{
      key: "strong",
      value: // no need for block level renderers
      function strong(text) {
        return text;
      }
    }, {
      key: "em",
      value: function em(text) {
        return text;
      }
    }, {
      key: "codespan",
      value: function codespan(text) {
        return text;
      }
    }, {
      key: "del",
      value: function del(text) {
        return text;
      }
    }, {
      key: "html",
      value: function html(text) {
        return text;
      }
    }, {
      key: "text",
      value: function text(_text) {
        return _text;
      }
    }, {
      key: "link",
      value: function link(href, title, text) {
        return '' + text;
      }
    }, {
      key: "image",
      value: function image(href, title, text) {
        return '' + text;
      }
    }, {
      key: "br",
      value: function br() {
        return '';
      }
    }]);

    return TextRenderer;
  }();

  var Slugger_1 = /*#__PURE__*/function () {
    function Slugger() {
      _classCallCheck(this, Slugger);

      this.seen = {};
    }

    _createClass(Slugger, [{
      key: "serialize",
      value: function serialize(value) {
        return value.toLowerCase().trim() // remove html tags
        .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');
      }
      /**
       * Finds the next safe (unique) slug to use
       */

    }, {
      key: "getNextSafeSlug",
      value: function getNextSafeSlug(originalSlug, isDryRun) {
        var slug = originalSlug;
        var occurenceAccumulator = 0;

        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];

          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }

        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }

        return slug;
      }
      /**
       * Convert string to unique id
       * @param {object} options
       * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
       */

    }, {
      key: "slug",
      value: function slug(value) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    }]);

    return Slugger;
  }();

  var Renderer$1 = Renderer_1;
  var TextRenderer$1 = TextRenderer_1;
  var Slugger$1 = Slugger_1;
  var defaults$1 = defaults$5.exports.defaults;
  var unescape = helpers.unescape;
  /**
   * Parsing & Compiling
   */

  var Parser_1 = /*#__PURE__*/function () {
    function Parser(options) {
      _classCallCheck(this, Parser);

      this.options = options || defaults$1;
      this.options.renderer = this.options.renderer || new Renderer$1();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.textRenderer = new TextRenderer$1();
      this.slugger = new Slugger$1();
    }
    /**
     * Static Parse Method
     */


    _createClass(Parser, [{
      key: "parse",
      value:
      /**
       * Parse Loop
       */
      function parse(tokens) {
        var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var out = '',
            i,
            j,
            k,
            l2,
            l3,
            row,
            cell,
            header,
            body,
            token,
            ordered,
            start,
            loose,
            itemBody,
            item,
            checked,
            task,
            checkbox;
        var l = tokens.length;

        for (i = 0; i < l; i++) {
          token = tokens[i];

          switch (token.type) {
            case 'space':
              {
                continue;
              }

            case 'hr':
              {
                out += this.renderer.hr();
                continue;
              }

            case 'heading':
              {
                out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
                continue;
              }

            case 'code':
              {
                out += this.renderer.code(token.text, token.lang, token.escaped);
                continue;
              }

            case 'table':
              {
                header = ''; // header

                cell = '';
                l2 = token.header.length;

                for (j = 0; j < l2; j++) {
                  cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), {
                    header: true,
                    align: token.align[j]
                  });
                }

                header += this.renderer.tablerow(cell);
                body = '';
                l2 = token.cells.length;

                for (j = 0; j < l2; j++) {
                  row = token.tokens.cells[j];
                  cell = '';
                  l3 = row.length;

                  for (k = 0; k < l3; k++) {
                    cell += this.renderer.tablecell(this.parseInline(row[k]), {
                      header: false,
                      align: token.align[k]
                    });
                  }

                  body += this.renderer.tablerow(cell);
                }

                out += this.renderer.table(header, body);
                continue;
              }

            case 'blockquote':
              {
                body = this.parse(token.tokens);
                out += this.renderer.blockquote(body);
                continue;
              }

            case 'list':
              {
                ordered = token.ordered;
                start = token.start;
                loose = token.loose;
                l2 = token.items.length;
                body = '';

                for (j = 0; j < l2; j++) {
                  item = token.items[j];
                  checked = item.checked;
                  task = item.task;
                  itemBody = '';

                  if (item.task) {
                    checkbox = this.renderer.checkbox(checked);

                    if (loose) {
                      if (item.tokens.length > 0 && item.tokens[0].type === 'text') {
                        item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;

                        if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                          item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                        }
                      } else {
                        item.tokens.unshift({
                          type: 'text',
                          text: checkbox
                        });
                      }
                    } else {
                      itemBody += checkbox;
                    }
                  }

                  itemBody += this.parse(item.tokens, loose);
                  body += this.renderer.listitem(itemBody, task, checked);
                }

                out += this.renderer.list(body, ordered, start);
                continue;
              }

            case 'html':
              {
                // TODO parse inline content if parameter markdown=1
                out += this.renderer.html(token.text);
                continue;
              }

            case 'paragraph':
              {
                out += this.renderer.paragraph(this.parseInline(token.tokens));
                continue;
              }

            case 'text':
              {
                body = token.tokens ? this.parseInline(token.tokens) : token.text;

                while (i + 1 < l && tokens[i + 1].type === 'text') {
                  token = tokens[++i];
                  body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
                }

                out += top ? this.renderer.paragraph(body) : body;
                continue;
              }

            default:
              {
                var errMsg = 'Token with "' + token.type + '" type was not found.';

                if (this.options.silent) {
                  console.error(errMsg);
                  return;
                } else {
                  throw new Error(errMsg);
                }
              }
          }
        }

        return out;
      }
      /**
       * Parse Inline Tokens
       */

    }, {
      key: "parseInline",
      value: function parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        var out = '',
            i,
            token;
        var l = tokens.length;

        for (i = 0; i < l; i++) {
          token = tokens[i];

          switch (token.type) {
            case 'escape':
              {
                out += renderer.text(token.text);
                break;
              }

            case 'html':
              {
                out += renderer.html(token.text);
                break;
              }

            case 'link':
              {
                out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
                break;
              }

            case 'image':
              {
                out += renderer.image(token.href, token.title, token.text);
                break;
              }

            case 'strong':
              {
                out += renderer.strong(this.parseInline(token.tokens, renderer));
                break;
              }

            case 'em':
              {
                out += renderer.em(this.parseInline(token.tokens, renderer));
                break;
              }

            case 'codespan':
              {
                out += renderer.codespan(token.text);
                break;
              }

            case 'br':
              {
                out += renderer.br();
                break;
              }

            case 'del':
              {
                out += renderer.del(this.parseInline(token.tokens, renderer));
                break;
              }

            case 'text':
              {
                out += renderer.text(token.text);
                break;
              }

            default:
              {
                var errMsg = 'Token with "' + token.type + '" type was not found.';

                if (this.options.silent) {
                  console.error(errMsg);
                  return;
                } else {
                  throw new Error(errMsg);
                }
              }
          }
        }

        return out;
      }
    }], [{
      key: "parse",
      value: function parse(tokens, options) {
        var parser = new Parser(options);
        return parser.parse(tokens);
      }
      /**
       * Static Parse Inline Method
       */

    }, {
      key: "parseInline",
      value: function parseInline(tokens, options) {
        var parser = new Parser(options);
        return parser.parseInline(tokens);
      }
    }]);

    return Parser;
  }();

  var Lexer = Lexer_1;
  var Parser = Parser_1;
  var Tokenizer = Tokenizer_1;
  var Renderer = Renderer_1;
  var TextRenderer = TextRenderer_1;
  var Slugger = Slugger_1;
  var merge = helpers.merge,
      checkSanitizeDeprecation = helpers.checkSanitizeDeprecation,
      escape = helpers.escape;
  var getDefaults = defaults$5.exports.getDefaults,
      changeDefaults = defaults$5.exports.changeDefaults,
      defaults = defaults$5.exports.defaults;
  /**
   * Marked
   */

  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }

    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
    }

    if (typeof opt === 'function') {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    if (callback) {
      var highlight = opt.highlight;
      var tokens;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }

      var done = function done(err) {
        var out;

        if (!err) {
          try {
            out = Parser.parse(tokens, opt);
          } catch (e) {
            err = e;
          }
        }

        opt.highlight = highlight;
        return err ? callback(err) : callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;
      if (!tokens.length) return done();
      var pending = 0;
      marked.walkTokens(tokens, function (token) {
        if (token.type === 'code') {
          pending++;
          setTimeout(function () {
            highlight(token.text, token.lang, function (err, code) {
              if (err) {
                return done(err);
              }

              if (code != null && code !== token.text) {
                token.text = code;
                token.escaped = true;
              }

              pending--;

              if (pending === 0) {
                done();
              }
            });
          }, 0);
        }
      });

      if (pending === 0) {
        done();
      }

      return;
    }

    try {
      var _tokens = Lexer.lex(src, opt);

      if (opt.walkTokens) {
        marked.walkTokens(_tokens, opt.walkTokens);
      }

      return Parser.parse(_tokens, opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';

      if (opt.silent) {
        return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
      }

      throw e;
    }
  }
  /**
   * Options
   */


  marked.options = marked.setOptions = function (opt) {
    merge(marked.defaults, opt);
    changeDefaults(marked.defaults);
    return marked;
  };

  marked.getDefaults = getDefaults;
  marked.defaults = defaults;
  /**
   * Use Extension
   */

  marked.use = function (extension) {
    var opts = merge({}, extension);

    if (extension.renderer) {
      (function () {
        var renderer = marked.defaults.renderer || new Renderer();

        var _loop = function _loop(prop) {
          var prevRenderer = renderer[prop];

          renderer[prop] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var ret = extension.renderer[prop].apply(renderer, args);

            if (ret === false) {
              ret = prevRenderer.apply(renderer, args);
            }

            return ret;
          };
        };

        for (var prop in extension.renderer) {
          _loop(prop);
        }

        opts.renderer = renderer;
      })();
    }

    if (extension.tokenizer) {
      (function () {
        var tokenizer = marked.defaults.tokenizer || new Tokenizer();

        var _loop2 = function _loop2(prop) {
          var prevTokenizer = tokenizer[prop];

          tokenizer[prop] = function () {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            var ret = extension.tokenizer[prop].apply(tokenizer, args);

            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args);
            }

            return ret;
          };
        };

        for (var prop in extension.tokenizer) {
          _loop2(prop);
        }

        opts.tokenizer = tokenizer;
      })();
    }

    if (extension.walkTokens) {
      var walkTokens = marked.defaults.walkTokens;

      opts.walkTokens = function (token) {
        extension.walkTokens(token);

        if (walkTokens) {
          walkTokens(token);
        }
      };
    }

    marked.setOptions(opts);
  };
  /**
   * Run callback for every token
   */


  marked.walkTokens = function (tokens, callback) {
    var _iterator = _createForOfIteratorHelper(tokens),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var token = _step.value;
        callback(token);

        switch (token.type) {
          case 'table':
            {
              var _iterator2 = _createForOfIteratorHelper(token.tokens.header),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var cell = _step2.value;
                  marked.walkTokens(cell, callback);
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              var _iterator3 = _createForOfIteratorHelper(token.tokens.cells),
                  _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var row = _step3.value;

                  var _iterator4 = _createForOfIteratorHelper(row),
                      _step4;

                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      var _cell = _step4.value;
                      marked.walkTokens(_cell, callback);
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              break;
            }

          case 'list':
            {
              marked.walkTokens(token.items, callback);
              break;
            }

          default:
            {
              if (token.tokens) {
                marked.walkTokens(token.tokens, callback);
              }
            }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  /**
   * Parse Inline
   */


  marked.parseInline = function (src, opt) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked.parseInline(): input parameter is undefined or null');
    }

    if (typeof src !== 'string') {
      throw new Error('marked.parseInline(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
    }

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    try {
      var tokens = Lexer.lexInline(src, opt);

      if (opt.walkTokens) {
        marked.walkTokens(tokens, opt.walkTokens);
      }

      return Parser.parseInline(tokens, opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';

      if (opt.silent) {
        return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
      }

      throw e;
    }
  };
  /**
   * Expose
   */


  marked.Parser = Parser;
  marked.parser = Parser.parse;
  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;
  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;
  marked.Tokenizer = Tokenizer;
  marked.Slugger = Slugger;
  marked.parse = marked;
  var marked_1 = marked;

  var Block = /*#__PURE__*/function () {
    function Block(wurd, path) {
      var _this = this;

      _classCallCheck(this, Block);

      this.wurd = wurd;
      this.path = path; // Private shortcut to the main content getter
      // TODO: Make a proper private variable
      // See http://voidcanvas.com/es6-private-variables/ - but could require Babel Polyfill to be included

      this._get = wurd.store.get.bind(wurd.store); // Bind methods to the instance to enable 'this' to be available
      // to own methods and added helper methods;
      // This also allows object destructuring, for example:
      // `const {text} = wurd.block('home')`

      var methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
      methodNames.forEach(function (name) {
        _this[name] = _this[name].bind(_this);
      });
    }
    /**
     * Gets the ID of a child content item by path (e.g. id('item') returns `block.item`)
     *
     * @param {String} path       Item path e.g. `section.item`
     *
     * @return {String}
     */


    _createClass(Block, [{
      key: "id",
      value: function id(path) {
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

    }, {
      key: "get",
      value: function get(path) {
        var result = this._get(this.id(path)); // If an item is missing, check that the section has been loaded


        if (typeof result === 'undefined' && this.wurd.draft) {
          var section = path.split('.')[0];

          if (!this._get(section)) {
            console.warn("Tried to access unloaded section: ".concat(section));
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

    }, {
      key: "text",
      value: function text(path, vars) {
        var text = this.get(path);

        if (typeof text === 'undefined') {
          return this.wurd.draft ? "[".concat(path, "]") : '';
        }

        if (typeof text !== 'string') {
          console.warn("Tried to get object as string: ".concat(path));
          return this.wurd.draft ? "[".concat(path, "]") : '';
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

    }, {
      key: "markdown",
      value: function markdown(path, vars, opts) {
        if (opts !== null && opts !== void 0 && opts.inline && marked_1.parseInline) {
          return marked_1.parseInline(this.text(path, vars));
        }

        return marked_1(this.text(path, vars));
      }
      /**
       * Iterates over a collection / list object with the given callback.
       *
       * @param {String} path
       * @param {Function} fn     Callback function with signature ({Function} itemBlock, {Number} index)
       */

    }, {
      key: "map",
      value: function map(path, fn) {
        var _this2 = this;

        var listContent = this.get(path) || _defineProperty({}, Date.now(), {});

        var index = 0;
        var keys = Object.keys(listContent).sort();
        return keys.map(function (key) {
          var currentIndex = index;
          index++;
          var itemPath = [path, key].join('.');

          var itemBlock = _this2.block(itemPath);

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

    }, {
      key: "block",
      value: function block(path, fn) {
        var blockPath = this.id(path);
        var childBlock = new Block(this.wurd, blockPath);

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

    }, {
      key: "el",
      value: function el(path, vars) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var id = this.id(path);
        var text = options.markdown ? this.markdown(path, vars) : this.text(path, vars);
        var editor = vars || options.markdown ? 'data-wurd-md' : 'data-wurd';

        if (this.wurd.draft) {
          var type = options.type || 'span';
          if (options.markdown) type = 'div';
          return "<".concat(type, " ").concat(editor, "=\"").concat(id, "\">").concat(text, "</").concat(type, ">");
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

    }]);

    return Block;
  }();

  var WIDGET_URL = 'https://widget.wurd.io/widget.js';
  var API_URL = 'https://api.wurd.io';

  var Wurd = /*#__PURE__*/function () {
    function Wurd(appName, options) {
      var _this = this;

      _classCallCheck(this, Wurd);

      this.store = new Store();
      this.content = new Block(this, null); // Add block shortcut methods to the main Wurd instance

      var methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.content));
      methodNames.forEach(function (name) {
        _this[name] = _this.content[name].bind(_this.content);
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


    _createClass(Wurd, [{
      key: "connect",
      value: function connect(appName) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.app = appName;
        this.draft = false;
        this.editMode = false; // Set allowed options

        ['draft', 'lang', 'debug'].forEach(function (name) {
          var val = options[name];
          if (typeof val !== 'undefined') _this2[name] = val;
        }); // Activate edit mode if required

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
       * @param {String|Array<String>} sectionNames     Array or comma-separated string of sections e.g. `common,user,items`
       */

    }, {
      key: "load",
      value: function load(sectionNames) {
        var _this3 = this;

        var app = this.app,
            store = this.store,
            debug = this.debug;
        return new Promise(function (resolve, reject) {
          if (!app) {
            return reject(new Error('Use wurd.connect(appName) before wurd.load()'));
          } // Normalise string sectionNames to array


          if (typeof sectionNames === 'string') sectionNames = sectionNames.split(','); // Check for cached sections

          var cachedContent = store.getSections(sectionNames);
          var uncachedSectionNames = Object.keys(cachedContent).filter(function (section) {
            return cachedContent[section] === undefined;
          });
          debug && console.info('from cache: ', uncachedSectionNames); // Return now if all content was in cache

          if (!uncachedSectionNames.length) {
            return resolve(_this3.content);
          } // Some sections not in cache; fetch them from server


          debug && console.info('from server: ', uncachedSectionNames);
          return _this3._fetchSections(uncachedSectionNames).then(function (fetchedContent) {
            // Cache for next time
            store.setSections(fetchedContent); // Return the main Block instance for using content

            resolve(_this3.content);
          })["catch"](function (err) {
            return reject(err);
          });
        });
      }
    }, {
      key: "_fetchSections",
      value: function _fetchSections(sectionNames) {
        var _this4 = this;

        var app = this.app; // Build request URL

        var params = ['draft', 'lang'].reduce(function (memo, param) {
          if (_this4[param]) memo[param] = _this4[param];
          return memo;
        }, {});
        var url = "".concat(API_URL, "/apps/").concat(app, "/content/").concat(sectionNames, "?").concat(encodeQueryString(params));
        return this._fetch(url).then(function (result) {
          if (result.error) {
            if (result.error.message) {
              throw new Error(result.error.message);
            } else {
              throw new Error("Error loading ".concat(sectionNames));
            }
          }
          return result;
        });
      }
    }, {
      key: "_fetch",
      value: function _fetch(url) {
        return fetch(url).then(function (res) {
          if (!res.ok) throw new Error("Error loading ".concat(url, ": ").concat(res.statusText));
          return res.json();
        });
      }
    }, {
      key: "startEditor",
      value: function startEditor() {
        var app = this.app,
            lang = this.lang; // Draft mode is always on if in edit mode

        this.editMode = true;
        this.draft = true;
        var script = document.createElement('script');
        script.src = WIDGET_URL;
        script.async = true;
        script.setAttribute('data-app', app);

        if (lang) {
          script.setAttribute('data-lang', lang);
        }

        document.getElementsByTagName('body')[0].appendChild(script);
      }
    }, {
      key: "setBlockHelpers",
      value: function setBlockHelpers(helpers) {
        Object.assign(Block.prototype, helpers);
      }
    }]);

    return Wurd;
  }();
  var instance = new Wurd();
  instance.Wurd = Wurd;

  return instance;

}));
