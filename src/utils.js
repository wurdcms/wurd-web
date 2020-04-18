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

  Object.keys(vars).forEach(key => {
    let val = vars[key];

    text = text.replace(new RegExp(`{{${key}}}`, 'g'), val);
    // Todo use https://github.com/tc39/proposal-string-replaceall in the future
  });

  return text;
};

export const getValue = (obj, path) => path.split('.').reduce((o, k) => o[k], obj);
