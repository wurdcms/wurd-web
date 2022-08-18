export default class Store {

  /**
   * @param {Object} rawContent            Initial content
   * @param {String} opts.storageKey       localStorage key
   * @param {Number} opts.maxAge           cache max-age in ms
   */
  constructor(rawContent = {}, opts = {}) {
    this.rawContent = rawContent;
    this.storageKey = opts.storageKey || 'cmsContent';
    this.maxAge = opts.maxAge ?? 3600000;
  }

  /**
   * Get a specific piece of content, top-level or nested
   *
   * @param {String} path e.g. 'section','section.subSection','a.b.c.d'
   * @return {Mixed}
   */
  get(path) {
    if (!path) return this.rawContent;

    return path.split('.').reduce((acc, k) => acc && acc[k], this.rawContent);
  }

  /**
   * Load content from localStorage
   *
   * @return {Object}
   */
  load() {
    try {
      const cachedContent = JSON.parse(localStorage.getItem(this.storageKey));

      if (!cachedContent || !cachedContent._expiry || cachedContent._expiry < Date.now()) return this.rawContent;

      return { ...cachedContent, ...this.rawContent };
    } catch (err) {
      console.error('Wurd: error loading cache:', err);

      return this.rawContent;
    }
  }

  /**
   * Save content in cache
   *
   * @param {Object} content
   */
  set(content) {
    Object.assign(this.rawContent, content);

    localStorage.setItem(this.storageKey, JSON.stringify({ ...this.rawContent, _expiry: Date.now() + this.maxAge }));
  }

};
