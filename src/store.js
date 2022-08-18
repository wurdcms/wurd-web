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
   * Load top-level sections of content
   *
   * @param {String[]} sectionNames
   * @return {Object}
   */
  loadCache(sectionNames) {
    let cachedContent;

    try {
      cachedContent = JSON.parse(localStorage.getItem(this.storageKey));
    } catch (err) {
      console.error('Wurd: error loading cache:', err);
    }

    this.rawContent = {
      ...!cachedContent || !cachedContent._expiry || cachedContent._expiry < Date.now() ? null : cachedContent,
      ...this.rawContent,
    };

    const entries = sectionNames.map(key => [key, this.rawContent[key]]);

    return Object.fromEntries(entries);
  }

  /**
   * Save top-levle sections of content
   *
   * @param {Object} sections       Top level sections of content
   */
  saveCache(sections) {
    Object.assign(this.rawContent, sections);

    localStorage.setItem(this.storageKey, JSON.stringify({ ...this.rawContent, _expiry: Date.now() + this.maxAge }));
  }

};
