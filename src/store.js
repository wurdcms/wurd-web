export default class Store {

  /**
   * @param {Object} rawContent       Initial content
   */
  constructor(rawContent = {}) {
    this.rawContent = rawContent;
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
  getSections(sectionNames) {
    const entries = sectionNames.map(key => [key, this.rawContent[key]]);

    return Object.fromEntries(entries);
  }

  /**
   * Save top-levle sections of content
   *
   * @param {Object} sections       Top level sections of content
   */
  setSections(sections) {
    Object.assign(this.rawContent, sections);
  }

};
