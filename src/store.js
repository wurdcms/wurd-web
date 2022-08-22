export default class Store {

  /**
   * @param {Object} rawContent           Initial content
   * @param {String} opts.storageKey      localStorage key
   * @param {Number} opts.ttl             cache time to live in ms (defaults to 1 hour)
   */
  constructor(rawContent = {}, opts = {}) {
    this.rawContent = rawContent;
    this.storageKey = opts.storageKey || 'wurdContent';
    this.ttl = opts.ttl ?? 3600000;
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
   * @param {String[]} sectionNames Names of top-level content sections to load e.g. ['main','nav']
   *    Unused here but likely to be used in future/other Store implementation
   * @param {Object} [options]
   * @param {String} [options.lang] Language
   * @return {Object} content
   */
  load(sectionNames, { lang } = {}) {
    const { rawContent, storageKey, ttl } = this;

    try {
      // Find cached content
      const cachedContent = JSON.parse(localStorage.getItem(storageKey));
      const metaData = cachedContent && cachedContent._wurd;

      // Check if it has expired
      if (!cachedContent || !metaData || (metaData.savedAt + ttl) < Date.now()) {
        return rawContent;
      }

      // Check it's in the correct language
      if (metaData.lang !== lang) {
        return rawContent;
      }

      // Remove metadata
      delete cachedContent['_wurd'];

      // Add cached content to memory content
      Object.assign(rawContent, cachedContent);

      return rawContent;
    } catch (err) {
      console.error('Wurd: error loading cache:', err);

      return rawContent;
    }
  }

  /**
   * Save top-level sections of content to localStorage
   *
   * @param {Object} sections
   * @param {Boolean} [options.cache] Whether to save the content to cache
   */
  save(sections, { lang } = {}) {
    const { rawContent, storageKey } = this;

    Object.assign(rawContent, sections);

    localStorage.setItem(storageKey, JSON.stringify({
      ...rawContent,
      _wurd: {
        savedAt: Date.now(),
        lang,
      },
    }));
  }

  /**
   * Clears the localStorage cache
   */
  clear() {
    localStorage.removeItem(this.storageKey);
  }

};
