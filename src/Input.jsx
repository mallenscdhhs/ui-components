'use-strict';
var React = require('react');
var FieldMixin = require('./FieldMixin');
var ValidationMixin = require('./ValidationMixin');
var _ = require('lodash');
var inputProps = ['type', 'id', 'name', 'maxLength', 'disabled', 'className', 'aria-describedby'];

module.exports = React.createClass({

  displayName: 'Input',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    maxLength: React.PropTypes.number
  },

  mixins: [FieldMixin, ValidationMixin],

  getInitialState: function(){
    return {
      value: this.props.value || ''
    };
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return <input value={this.state.value} onChange={this.handleInputChange} {...props}/>;
  }

});
