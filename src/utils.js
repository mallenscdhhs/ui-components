var _ = require('lodash');
var setClassNames = require('classnames');

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
* @return {string}
*/
exports.getActionClasses = function(props){
  return setClassNames('btn', props.classNames, {'link': (props.type === 'link'), 'disabled': props.disabled});
};

/**
* Returns a config object with a few computed properties
* @param {string} fieldId - Pass in the fieldId from the parent
* component and return computed props to the owner component
* @return {object}
*/
exports.getComputedInputAttr = function(fieldId){
  return {
    'className': 'form-control',
    'aria-describedby': fieldId+'-help-block'
  };
};
