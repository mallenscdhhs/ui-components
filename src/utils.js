import _ from 'lodash';
import setClassNames from 'classnames';

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

/**
* Returns an 'mm/dd/yyyy' formatted date string from the JS Date
* @param {string} currentValue - Pass in the JS Date
* @return {string}
*/
exports.getDateString = (currentValue) => {
  let value = new Date(currentValue);
  let dd = _.padLeft(value.getDate(), 2, '0');
  // January is 0
  let mm = _.padLeft(value.getMonth() + 1, 2, '0');
  let yyyy = value.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};
