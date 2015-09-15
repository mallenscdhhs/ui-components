'use-strict';
import React from 'react';
import {Input} from 'react-bootstrap';
import classNames from 'classnames';
import _ from 'lodash';
import FieldLabel from './FieldLabel';
import FieldGroup from './FieldGroup';
import DateComponent from './Date';
import File from './File';
import masker from './input-masker';

/**
 * @class Field
 */
class Field extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Returns whether or not the Field type is "radio" or "checkbox".
   * @returns {bool}
   */
  isRadioOrCheckbox() {
    return /radio|checkbox/.test(this.props.type);
  }

  /**
   * Boolean helper if type is radio or checkbox.  Used to determine if we
   * need to use special wrapper for those field types.
   * Check the type AND if there are available items to show.
   * @returns {object}
   */
  isFieldGroup() {
    let hasOptions = !!(this.props.options || this.props.optionsResource);
    return this.isRadioOrCheckbox() && hasOptions;
  }

  /**
   * Creates specified field type component.
   * @param {string} type
   * @returns {JSX}
   */
  getInputControl() {
    switch(this.props.type) {
      case 'radio':
      case 'checkbox':
        return this.isFieldGroup()? FieldGroup : Input;
      case 'date':
        return DateComponent;
      case 'file':
        return File;
      default:
        return Input;
    };
  }

  getInputProps() {
    let props = _.pick(this.props, this.props.inputProps);
    let help = this.props.message || this.props.helpText;
    props.value = this.getDisplayValue();
    props.help = help;
    props.onChange = this.handleChange;
    props.onBlur = this.handleBlur;
    props.bsStyle = classNames({error: this.props.hasError});
    props.label = <FieldLabel {...this.props}/>;
    if (this.props.type === 'select') {
      let options = this.props.options || [];
      let renderOption = opt => <option value={opt.value}>{opt.label}</option>;
      props.children = _.map(options, renderOption);
    }

    return props;
  }

  getDisplayValue() {
    let value = this.props.value;
    if (this.props.mask && !_.isEmpty(value)) {
      value = masker.mask(this.props.mask, value);
    }

    return value;
  }

  handleChange(e) {
    let value = e.target.value;
    let schemaUpdates = {};
    if (this.isRadioOrCheckbox()) {
      value = e.target.checked? this.props.value : null;
      schemaUpdates.checked = e.target.checked;
    }

    e.component = {
      id: this.props.id,
      schemaUpdates,
      modelUpdates: {
        id: this.props.name,
        value
      }
    };
  }

  handleBlur(e) {
    e.component = this.props;
  }

  /**
   * Render a Field component.
   * @returns {JSX}
   */
  render() {
    let Control = this.getInputControl()
    let props = this.getInputProps();
    return this.props.visible? <Control {...props}/> : null;
  }
}

Field.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  required: React.PropTypes.bool,
  helpText: React.PropTypes.string,
  visible: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  mask: React.PropTypes.string,
  forceManualInput: React.PropTypes.bool
};

Field.defaultProps = {
  inputProps: ['id', 'name', 'type', 'disabled', 'checked', 'multiple'],
  componentType: 'field',
  initialState: 'visible',
  disabled: false,
  visible: true,
  mask: '',
  forceManualInput: false,
  hasError: false,
  errorMessage: ''
};

export default Field;
