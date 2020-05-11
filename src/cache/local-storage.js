export default class LocalStorageCache {
  /**
   * @param {String} key
   *
   * @resolves {Object|Null}
   */
  get(key) {
    const item = localStorage.getItem(key);

    return Promise.resolve(item ? JSON.parse(item) : undefined);
  }

  /**
   * @param {String} key
   * @param {Object} val
   *
   * @resolves
   */
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    return Promise.resolve();
  }
}
