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
import {KEY_CODES} from './constants';

let {BACKSPACE} = KEY_CODES;

/**
 * @class Field
 */
class Field extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
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

  /**
   * Returns a dictionary of event handlers allowed for this field.
   * @returns {object}
   */
  getEventHandlers() {
    let preventDefault = e => e.preventDefault();
    let manualInputEvents = this.props.forceManualInput ? {
      onPaste: preventDefault,
      onCopy: preventDefault,
      onCut: preventDefault,
      onDrag: preventDefault,
      onDrop: preventDefault,
      autoComplete: 'off'
    } : {};
    return _.merge({
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown
    }, manualInputEvents);
  }

  /**
   * Create the Input props.
   * @returns {object}
   */
  getInputProps() {
    let props = _.pick(this.props, this.props.inputProps);
    let help = this.props.message || this.props.helpText;
    props.value = this.getDisplayValue();
    props.help = help;
    props.bsStyle = classNames({error: this.props.hasError});
    props.label = <FieldLabel {...this.props}/>;
    // If we have a single option checkbox/radio, that does not get it's values from the 'options' or 'optionsResource'
    // props, then check to see if the current value matches the default value, and if so, the field is checked
    if (this.isRadioOrCheckbox() && !this.isFieldGroup()) {
      props.checked = FieldGroup.isOptionChecked({value: this.props.submitValue }, props.value);
    }
    if (this.props.type === 'select') {
      let options = this.props.options || [];
      let renderOption = opt => <option value={opt.value}>{opt.label}</option>;
      props.children = _.map(options, renderOption);
    }

    return props;
  }

  /**
   * Effectively masks the input value.
   * @returns {string} masked value
   */
  getDisplayValue() {
    let value = this.props.value;
    if (this.props.mask && !_.isEmpty(value)) {
      value = masker.mask(this.props.mask, value);
    }

    return value;
  }

  /**
   * Ensure that value is not greater than specified max.
   * @param {string} value
   * @returns {string}
   */
  forceMaxLength(value) {
    let max = Number(this.props.max);
    let min = Number(this.props.min);
    let result = value;
    if (min && max && (min === max)) {
      result = value.slice(0, max);
    }

    return result;
  }

  handleChange(e) {
    let value = e.target.value;
    let schemaUpdates = {};


    // Single instance fields, where their value does not come from the 'options' or 'optionsResource', but
    // from the 'value' and 'submitValue' props.  If the field is 'unchecked', the value is 'null', so we need to have a
    // reference value that is not nullable to replace when 'checking' later.  For this, we use the 'submitValue' prop.
    if (this.isRadioOrCheckbox()) {
      value = e.target.checked? this.props.submitValue : null;
      schemaUpdates.checked = e.target.checked;
    }

    if (this.props.mask && this.props.value) {
      let newChar = value.slice(-1);
      value = this.props.value + newChar;
    }

    value = this.forceMaxLength(value);

    e.component = {
      id: this.props.id,
      schemaUpdates,
      modelUpdates: {
        id: this.props.name,
        value
      },
      props: this.props
    };
  }

  /**
   * Masked inputs will not respect the BACKSPACE key, so we must
   * manually handle that action here.
   */
  handleKeyDown(e) {
    if (this.props.mask && e.keyCode === BACKSPACE) {
      let value = this.props.value.slice(0, -1);
      e.preventDefault();
      e.component = {
        id: this.props.id,
        modelUpdates: {
          id: this.props.name,
          value
        }
      };
    }
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
    let handlers = this.getEventHandlers();
    return this.props.visible? <Control ref="field" {...props} {...handlers}/> : null;
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
  inputProps: ['id', 'name', 'type', 'disabled', 'checked', 'multiple', 'options'],
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
