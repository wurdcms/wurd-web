/**
 * Replaces {{mustache}} style placeholders in text with variables
 *
 * @param {String} text
 * @param {Object} vars
 *
 * @return {String}
 */
export function replaceVars(text, vars = {}) {
  if (typeof text !== 'string') return text;

  Object.entries(vars).forEach(([key, val]) => {
    text = text.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });

  return text;
};



/**
 * Returns the key for caching a block of content, including the language
 *
 * @param {String} containerId
 * @param {Object} [options]
 *
 * @return {String} cacheId
 */
export function getCacheId(containerId, options = {}) {
  const lang = options.lang || '';

  return `${lang}/${containerId}`;
}
