import _ from 'lodash';
import setClassNames from 'classnames';

/**
 * Determines if the passed-in list contains a value from the passedin "values" array.
 * @param {array} list - the array containing values to compare with
 * @param {array} values - the array contains values to find
 * @returns {boolean}
 */
exports.containsOneOf = (list, values) => {
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
exports.getClasses = (props) => {
  return setClassNames(props.classNames, {link: (props.type === 'link'), disabled: props.disabled});
};

/**
* Returns a config object with a few computed properties
* @param {string} fieldId - Pass in the fieldId from the parent
* component and return computed props to the owner component
* @return {object}
*/
exports.getComputedInputAttr = (fieldId) => {
  return {
    className: 'form-control',
    'aria-describedby': `${fieldId}-help-block`
  };
};

/**
* Determines whether or not a field should be visible based on values of dependent
* fields on previous pages, returns a props object
* @param {object} props - Pass in the field's props
* @param {object} model - Pass in the application model
* @param {object} opConfig - Pass in a config with properties relevant to the operation
* @return {object}
*/
exports.getDependentVisibility = (props, model, opConfig) => {
  let depName = opConfig.get('dependencyName');
  let depValue = opConfig.get('dependencyValue');
  let dependencyMet = model.get(depName) ? (model.get(depName) === depValue) : false;
  // hide this field if the desired dependency value has not been met
  return dependencyMet ? false : props.set('initialState', 'hidden');
};

/**
* Returns an updated model with concatonated field values from previous pages as
* the current field's value
* @param {object} props - Pass in the field's props
* @param {object} model - Pass in the application model
* @param {object} opConfig - Pass in a config with properties relevant to the operation
* @return {object}
*/
exports.composeFromFields = (props, model, opConfig) => {
  let fieldsArray = opConfig.get('fieldsArray');
  let fieldValues = fieldsArray.map((field) => (typeof field !== 'undefined') ? model.get(field) : null);
  // set the current field's value to the concatonated values in the fieldsArray
  return model.set(props.get('id'), fieldValues.join(' '));
};
