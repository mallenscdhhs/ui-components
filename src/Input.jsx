'use-strict';
var React = require('react');
var _ = require('lodash');
var ValueChangeMixin = require('./ValueChangeMixin');
var inputMaskUtils = require('./inputMaskUtils');

/**
 * Renders an <input> control.
 * @module Input
 */
module.exports = React.createClass({

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

  getDefaultProps: function(){
    return {
      inputProps: ['type', 'id', 'name', 'maxLength', 'disabled', 'className', 'aria-describedby', 'min', 'max']
    };
  },

  getMaskProps: function() {
    return {'onKeyDown': this.handleKeyDown, 'onPaste': this.handlePaste};
  },

  getManualInputProps: function() {
    return {
      onPaste: this.handleComputedInput,
      onCopy: this.handleComputedInput,
      onCut: this.handleComputedInput,
      onDrag: this.handleComputedInput,
      onDrop: this.handleComputedInput,
      autoComplete: 'off'
    };
  },

  getInitialState: function(){
    return {
      value: '',
      unmasked: '',
      keyPressed: ''
    };
  },

  componentWillMount: function(){
    this.setState({value: this.props.value});
  },

  handleComputedInput: function(e) {
    e.preventDefault();
  },

  handleKeyDown: function(e) {
    this.setState({
      keyPressed: e.which
    });
  },

  handlePaste: function(e) {
    var pasted = e.clipboardData.getData('Text');
    e.preventDefault();
    this.handleInputChange({target: {value: pasted}, pasted: pasted});
  },

  handleInputChange: function(event){
    if(this.props.mask) {
      var customConfig = {
        maskSymbol: this.props.maskSymbol,
        maskAllowedStringType: this.props.maskAllowedStringType
      };
      var maskConfig = inputMaskUtils.getMaskConfig(this.props.mask, customConfig);
      event.keyPressed = this.state.keyPressed;
      event.unmasked = this.state.unmasked;
      event.stateChange = inputMaskUtils.getMaskedOutput(maskConfig, event);
    }
    this.onChange(event);
  },

  render: function(){
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
