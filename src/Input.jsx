'use-strict';
var React = require('react');
var _ = require('lodash');
var ValueChangeMixin = require('./ValueChangeMixin');
var FieldMaskMixin = require('./FieldMaskMixin');

/**
 * Renders an <input> control.
 * @module Input
 */
module.exports = React.createClass({

  displayName: 'Input',

  mixins: [ValueChangeMixin, FieldMaskMixin],

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
    maskAllowedStringType: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      inputProps: ['type', 'id', 'name', 'maxLength', 'disabled', 'className', 'aria-describedby']
    };
  },

  getMaskProps: function() {
    return {'onKeyDown': this.handleKeyDown, 'onPaste': this.handlePaste};
  },

  getInitialState: function(){
    return {
      value: this.props.value || '',
      maskConfig: {},
      unmasked: '',
      keyPressed: ''
    };
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    var maskProps = (this.props.mask) ? this.getMaskProps() : null;
    return (
      <input
        {...props}
        {...maskProps}
        value={this.state.value}
        onChange={this.onChange} />
    );
  }

});
