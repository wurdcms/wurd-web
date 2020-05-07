import getValue from 'get-property-value';


export default class Store {

  /**
   * @param {Object} rawContent       Initial content
   */
  constructor(rawContent = {}) {
    this.rawContent = rawContent;
  }

  /**
   * @param {String} itemId     ID/path of content item to get e.g. `main.title`
   *
   * @return {Mixed}
   */
  get(itemId) {
    return getValue(this.rawContent, itemId);
  }

  /**
   * @param {Object} containers       Content of top-level containers
   */
  set(containers) {
    Object.assign(this.rawContent, containers);
  }

};
