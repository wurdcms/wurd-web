/**
 * @param {Object} data
 *
 * @return {String}
 */
export const encodeQueryString = function(data) {
  let parts = Object.keys(data).map(key => {
    let value = data[key];

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
export const replaceVars = function(text, vars = {}) {
  if (typeof text !== 'string') return text;

  Object.keys(vars).forEach(key => {
    let val = vars[key];

    text = text.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });

  return text;
};
