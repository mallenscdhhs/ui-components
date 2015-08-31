'use-strict';
let React = require('react');
let _ = require('lodash');
let Immutable = require('immutable');
let ValueChangeMixin = require('./ValueChangeMixin');
let inputMaskUtils = require('./inputMaskUtils');

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
      inputProps: ['type', 'id', 'name', 'maxLength', 'disabled', 'className', 'aria-describedby', 'min', 'max']
    };
  },

  getMaskProps() {
    return {onKeyDown: this.handleKeyDown, onPaste: this.handlePaste};
  },

  getManualInputProps() {
    return {
      onPaste: this.handleComputedInput,
      onCopy: this.handleComputedInput,
      onCut: this.handleComputedInput,
      onDrag: this.handleComputedInput,
      onDrop: this.handleComputedInput,
      autoComplete: 'off'
    };
  },

  getInitialState() {
    return {
      value: '',
      unmasked: '',
      keyPressed: ''
    };
  },

  componentWillMount() {
    if (this.props.mask) {
      this.handleInputChange({target: {value: this.props.value}, pasted: this.props.value});
    } else {
      this.setState({value: this.props.value});
    }
  },

  componentWillReceiveProps({value}) {
    if (value) {
      this.handleInputChange({target: {value: value}, pasted: value});
    }
  },

  handleComputedInput(e) {
    e.preventDefault();
  },

  handleKeyDown(e) {
    this.setState({
      keyPressed: e.which
    });
  },

  handlePaste(e) {
    var pasted = e.clipboardData.getData('Text');
    e.preventDefault();
    this.handleInputChange({target: {value: pasted}, pasted: pasted});
  },

  handleInputChange(event) {
    let changeEvent = event;
    if (this.props.mask) {
      let customConfig = {
        maskSymbol: this.props.maskSymbol,
        maskAllowedStringType: this.props.maskAllowedStringType
      };
      let maskConfig = inputMaskUtils.getMaskConfig(this.props.mask, customConfig);
      let _event = Immutable.Map(event).withMutations(evt => {
        evt
          .set('keyPressed', this.state.keyPressed)
          .set('unmasked', this.state.unmasked)
          .set('stateChange', inputMaskUtils.getMaskedOutput(maskConfig, evt.toJSON()));
      });
      changeEvent = _event.toJSON();
    }
    this.onChange(changeEvent);
  },

  render() {
    var props = _.pick(this.props, this.props.inputProps);
    var maskProps = (this.props.mask) ? this.getMaskProps() : null;
    var manualInputProps = (this.props.forceManualInput) ? this.getManualInputProps() : null;
    return (
      <input
        {...props}
        {...maskProps}
        {...manualInputProps}
        value={this.state.value}
        onChange={this.handleInputChange}
        onBlur={this.onBlur}/>
    );
  }

});
