export default class MemoryCache {

  constructor() {
    this.items = {};
  }

  /**
   * @param {String} key
   *
   * @resolves {Object|Undefined}
   */
  get(key) {
    return Promise.resolve(this.items[key]);
  }

  /**
   * @param {String} key
   * @param {Object} val
   *
   * @resolves
   */
  set(key, val) {
    this.items[key] = val;
    return Promise.resolve();
  }

};
