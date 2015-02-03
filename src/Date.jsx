'use-strict';
var React = require('react');
var FieldMixin = require('./FieldMixin');
var _ = require('lodash');
var inputProps = ['id', 'name', 'value', 'cols', 'rows', 'maxLength', 'className', 'aria-describedby'];
var DateTimePicker = require('react-widgets').DateTimePicker;

module.exports = React.createClass({

  displayName: 'Date',

  mixins: [FieldMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      value: this.props.value || ''
    };
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return <DateTimePicker time={false} onChange={this.handleInputChange} value={this.state.value} {...props} />;
  }

});
