'use-strict';
import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import ValueChangeMixin from './ValueChangeMixin';
import masker from './input-masker';
import constants from './constants';

let {BACKSPACE} = constants.keyCodes;

/**
 * Renders an <input> control.
 * @module Input
 */
export default React.createClass({

  displayName: 'Input',

  mixins: [ValueChangeMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    maxLength: React.PropTypes.number,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string),
    mask: React.PropTypes.string,
    maskSymbol: React.PropTypes.string,
    maskAllowedStringType: React.PropTypes.string,
    forceManualInput: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      inputProps: ['type', 'id', 'name', 'disabled', 'className', 'aria-describedby']
    };
  },

  getManualInputProps() {
    return this.props.forceManualInput ? {
      onPaste: this.handleComputedInput,
      onCopy: this.handleComputedInput,
      onCut: this.handleComputedInput,
      onDrag: this.handleComputedInput,
      onDrop: this.handleComputedInput,
      autoComplete: 'off'
    } : {
      onPaste: this.handlePaste
    };
  },

  getInitialState() {
    return {
      value: ''
    };
  },

  componentWillMount() {
    let {value} = this.props;
    if (value) {
      this.setState({value});
    }
  },

  componentWillReceiveProps({value}) {
    // Determine if new value is being sent to input, and if it als has a mask, determine if the newly masked value
    // is different from the current value. If so, kick off the 'onChange' flow for the input, which includes properly
    // masking the value, validating it and updating the application data.
    if (value !== undefined && value !== this.state.value) {
      this.setState({value});
    }
  },

  handleComputedInput(e) {
    e.preventDefault();
  },

  handlePaste(e) {
    let pasted = e.clipboardData.getData('Text');
    let value = this.forceMaxLength(pasted);
    this.onChange({target: {value}});
    e.preventDefault();
  },

  handleKeyDown(e) {
    if (this.props.mask && e.keyCode === BACKSPACE) {
      let value = this.state.value.slice(0, -1);
      this.onChange({target: {value}});
      e.preventDefault();
    }
  },

  handleInputChange(e) {
    let nextValue = e.target.value;

    // e.target.value will contain mask chars, we just want the new unmasked char
    if (this.props.mask) {
      let newChar = nextValue.slice(-1);
      nextValue = this.state.value + newChar;
    }

    // masking will cause issues with max length, so enforce it here
    let value = this.forceMaxLength(nextValue);

    // dont fire a change event if the value didnt actually change
    if (value !== this.state.value) {
      this.onChange({target: {value}});
    }
  },

  /**
   * Returns a masked value if "mask" property is configured.
   * @returns {string}
   */
  getDisplayValue() {
    var value = this.state.value;
    if (this.props.mask && !_.isEmpty(value)) {
      value = masker.mask(this.props.mask, value);
    }
    return value;
  },

  /**
   * Will slice off any trailing characters that are over max length. If min &
   * max properties are the same it is treated like a max length in Bosch.
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
  },

  render() {
    let props = _.pick(this.props, this.props.inputProps);
    let manualInputProps = this.getManualInputProps();
    let displayValue = this.getDisplayValue();
    return (
      <input
        {...props}
        {...manualInputProps}
        value={displayValue}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleInputChange}
        onBlur={this.onBlur}/>
    );
  }

});
