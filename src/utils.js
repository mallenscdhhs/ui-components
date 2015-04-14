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

/**
* Returns a string of classes
* @param {object} props - Abstract the classNames array, type string,
* and disabled boolean from the parent component to determine which
* classes should be passed to the owner component
* @return {String}
*/
exports.getClasses = function(props){
  var classes = ['btn'];
  // Add default link-type for action links
  if(props.type === 'link'){
    classes.push('btn-link');
  }
  // Add all passed in classes
  if(props.classNames){
    classes = classes.concat(props.classNames);
  }
  if(props.disabled === true){
    classes.push('disabled');
  }
  return classes.join(' ');
};
