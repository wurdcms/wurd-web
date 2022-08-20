export default class Store {

  /**
   * @param {Object} rawContent            Initial content
   * @param {String} opts.storageKey       localStorage key
   * @param {Number} opts.maxAge           cache max-age in ms (default 1 hour)
   */
  constructor(rawContent = {}, opts = {}) {
    this.rawContent = rawContent;
    this.storageKey = opts.storageKey || 'wurdContent';
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
   * Load top-level sections of content from localStorage
   *
   * @param {String[]} sectionNames
   * @return {Object} content
   */
  load(sectionNames) {
    try {
      const cachedContent = JSON.parse(localStorage.getItem(this.storageKey));

      if (!cachedContent || !cachedContent._expiry || cachedContent._expiry < Date.now()) {
        return this.rawContent;
      }

      delete cachedContent['_expiry'];

      Object.assign(this.rawContent, cachedContent);

      return this.rawContent;
    } catch (err) {
      console.error('Wurd: error loading cache:', err);

      return this.rawContent;
    }
  }

  /**
   * Save top-level sections of content to localStorage
   *
   * @param {Object} content
   * @param {Boolean} [options.cache] Whether to save the content to cache
   */
  save(content) {
    Object.assign(this.rawContent, content);

    localStorage.setItem(this.storageKey, JSON.stringify({
      ...this.rawContent,
      _expiry: Date.now() + this.maxAge,
    }));
  }

  /**
   * Clears the localStorage cache
   */
  clear() {
    localStorage.removeItem(this.storageKey);
  }

};
