/*
 # utilities.js
 # Utility Methods
 */


/**
 * Checks whether an array of items have any non-undefined or empty values.
 * @param  {array} items An array of items.
 * @return {bool}        Returns true or false
 */
const exists = (items) => {
  let result;
  if (Array.isArray(items)) {
    result = items.some(i => i !== undefined && i !== '');
  } else {
    result = items !== undefined && items !== '';
  }
  return result;
};

/**
 * Tries to parse JSON, returns undefined if input is invalid.
 * @param  {string} string  String to be parsed.
 * @return {object}         Returns JSON or undefined
 */
const jsonTryParse = (string) => {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (err) {
    return undefined;
  }
};

/**
 * Removes undefined keys from an object.
 * @param  {object} object  Object to be trimmed.
 * @return {object}         Returns a object with no undefined keys.
 */
const trimObject = (object) => {
  const result = Object.keys(object).reduce((a, key) => {
    const obj = { ...a };
    const value = object[key];

    if (Array.isArray(value) && value.length > 0) {
      obj[key] = value;
    } else if (!Array.isArray(value) && value !== undefined) {
      obj[key] = value;
    }
    return obj;
  }, {});
  return result;
};

/**
 # Module Exports
 */

module.exports = {
  exists,
  jsonTryParse,
  trimObject,
};
