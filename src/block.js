import marked from 'marked';
import getValue from 'get-property-value';

import { replaceVars } from './utils';


export default class Block {

  constructor(app, path, content, options = {}) {
    this.app = app;
    this.path = path;
    this.content = content;

    this.lang = options.lang;
    this.draft = options.draft;
    this.editMode = options.editMode;


    // Private shortcut to the main content getter
    // TODO: Make a proper private variable
    // See http://voidcanvas.com/es6-private-variables/ - but could require Babel Polyfill to be included
    // this._get = wurd.store.get.bind(wurd.store);

    // Bind methods to the instance to enable 'this' to be available
    // to own methods and added helper methods;
    // This also allows object destructuring, for example:
    // `const {text} = wurd.block('home')`
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    methodNames.forEach(name => {
      this[name] = this[name].bind(this);
    });

    // console.log('new block', path, options, content);
  }

  /**
   * Gets the ID of a child content item by path (e.g. id('item') returns `block.item`)
   *
   * @param {String} path       Item path e.g. `section.item`
   *
   * @return {String}
   */
  id(path) {
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
  get(path) {
    // const result = this._get(this.id(path));
    const result = getValue(this.content, path);

    // If an item is missing, check that the section has been loaded
    /* if (typeof result === 'undefined' && this.draft) {
      const section = path.split('.')[0];

      if (!this._get(section)) {
        console.warn(`Tried to access unloaded section: ${section}`);
      }
    } */

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
  text(path, vars) {
    let text = this.get(path);

    if (typeof text === 'undefined') {
      return (this.draft) ? `[${path}]` : '';
    }

    if (typeof text !== 'string') {
      console.warn(`Tried to get object as string: ${path}`);

      return (this.draft) ? `[${path}]` : '';
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
   *
   * @return {Mixed}
   */
  markdown(path, vars) {
    return marked(this.text(path, vars));
  }

  /**
   * Iterates over a collection / list object with the given callback.
   *
   * @param {String} path
   * @param {Function} fn     Callback function with signature ({Function} itemBlock, {Number} index)
   */
  map(path, fn) {
    const listContent = this.get(path) || { [Date.now()]: {} };

    let index = 0;

    const keys = Object.keys(listContent).sort();

    return keys.map(key => {
      const currentIndex = index;

      index++;

      const itemPath = [path, key].join('.');
      const itemBlock = this.block(itemPath);

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
  block(path, fn) {
    const blockPath = this.id(path);

    const childBlock = new Block(this.app, blockPath, this.get(path), {
      lang: this.lang,
      draft: this.draft,
      editMode: this.editMode,
    });

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
  el(path, vars, options = {}) {
    const id = this.id(path);
    const text = options.markdown ? this.markdown(path, vars) : this.text(path, vars);
    const editor = (vars || options.markdown) ? 'data-wurd-md' : 'data-wurd';

    if (this.draft) {
      let type = options.type || 'span';

      if (options.markdown) type = 'div';

      return `<${type} ${editor}="${id}">${text}</${type}>`;
    }

    return text;
  }

  /**
   * Returns the HTML script tag which starts the Wurd editor
   *
   * @return {String}
   */
  includeEditor() {
    if (!this.editMode) return '';

    const { app, lang } = this;

    return `<script src="https://edit-v3.wurd.io/widget.js" data-app="${app}" data-lang="${lang || ''}"></script>`;
  }

};
