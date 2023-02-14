/**
 * @param {Object} data
 *
 * @return {String}
 */
export function encodeQueryString(data) {
  const parts = Object.keys(data).map(key => {
    const value = data[key];

    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });

  return parts.join('&');
};


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

  return text.replace(/{{([\w.-]+)}}/g, (_, key) => vars[key] ?? '');
};
