export default class Store {

  /**
   * @param {Object} rawContent       Initial content
   */
  constructor(rawContent = {}) {
    this.rawContent = rawContent;
  }

  /**
   * @param {String} path
   * @return {Mixed}
   */
  get(path) {
    return path.split('.').reduce((acc, k) => acc && acc[k], this.rawContent);
  }

  /**
   * Load prefixes from store, if one prefix is missing return null
   * @param {String} prefixes
   * @return {Mixed}
   */
  getAll(prefixes) {
    const entries = `${prefixes}`.split(',').map(key => [key, this.rawContent[key]]);

    if (entries.every(entry => entry[1])) return Object.fromEntries(entries);

    return null;
  }

  /**
   * @param {Object} sections       Top level sections of content
   */
  setSections(sections) {
    Object.assign(this.rawContent, sections);
  }

};
