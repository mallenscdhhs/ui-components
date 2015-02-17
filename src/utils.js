var _ = require('lodash');

/**
 * Determines if the passed-in list contains a value from the passedin "values" array.
 * @param {array} list - the array containing values to compare with
 * @param {array} values - the array contains values to find
 * @returns {boolean}
 */
exports.containsOneOf = function(list, values){
  if ( !values.length ) return false;
  return _.contains(list, _.first(values)) || exports.containsOneOf(list, _.rest(values));
};
