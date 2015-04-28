'use-strict';
var React = require('react');
var _ = require('lodash');
var ValueChangeMixin = require('./ValueChangeMixin');

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
    forceManualInput: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      inputProps: ['type', 'id', 'name', 'maxLength', 'disabled', 'className', 'aria-describedby']
    };
  },

  getManualInputProps: function() {
    return {
      type: 'text',
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
      value: this.props.value || ''
    };
  },

  handleComputedInput: function(e) {
    e.preventDefault();
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    var manualInputProps = (this.props.forceManualInput) ? this.getManualInputProps() : null;
    return (
      <input
        {...props}
        {...manualInputProps}
        value={this.state.value}
        onChange={this.onChange} />
    );
  }

});
