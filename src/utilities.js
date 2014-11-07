/**
 * Returns the passed-in string with the first character capitalized.
 * @params {string} str
 * @returns {string}
 */
exports.initialCap = function(str){
  return [str.slice(0,1).toUpperCase(), str.slice(1)].join('');
};
