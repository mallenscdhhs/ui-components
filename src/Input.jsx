'use-strict';
var React = require('react');
var _ = require('lodash');
var ValueChangeMixin = require('./ValueChangeMixin');
var FieldValueMixin = require('./FieldValueMixin');

/**
 * Renders an <input> control.
 * @module Input
 */
module.exports = React.createClass({

  displayName: 'Input',

  mixins: [ValueChangeMixin, FieldValueMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    maxLength: React.PropTypes.number,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps: function(){
    return {
      inputProps: ['type', 'id', 'name', 'maxLength', 'disabled', 'className', 'aria-describedby']
    };
  },

  getInitialState: function(){
    return {
      value: this.props.value || ''
    };
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    return <input value={this.state.value} onChange={this.onChange} {...props}/>;
  }

});
