export default class Cache {

  constructor() {
    this.items = {};
  }

  /**
   * @param {String} key
   *
   * @resolves {Mixed}
   */
  get(key) {
    return Promise.resolve(this.items[key]);
  }

  /**
   * @param {String} key
   * @param {Mixed} val
   *
   * @resolves
   */
  set(key, val) {
    this.items[key] = val;
    return Promise.resolve();
  }

};
