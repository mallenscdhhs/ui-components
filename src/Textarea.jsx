'use-strict';
var React = require('react');
var _ = require('lodash');
var ValueChangeMixin = require('./ValueChangeMixin');
var FieldValueMixin = require('./FieldValueMixin');

/**
 * Renders a <textarea> input control.
 * @module Textarea
 */
module.exports = React.createClass({

  displayName: 'Textarea',

  mixins: [ValueChangeMixin, FieldValueMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    rows: React.PropTypes.string,
    cols: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps: function(){
    return {
      inputProps: ['id', 'name', 'value', 'cols', 'rows', 'maxLength', 'className', 'aria-describedby']
    };
  },

  getInitialState: function(){
    return {
      value: this.props.value || ''
    };
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    return <textarea value={this.state.value} onChange={this.onChange} {...props} />;
  }

});
