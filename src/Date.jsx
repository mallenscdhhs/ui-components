'use-strict';
var React = require('react');
var _ = require('lodash');
var DateTimePicker = require('react-widgets').DateTimePicker;
var ValueChangeMixin = require('./ValueChangeMixin');
var FieldValueMixin = require('./FieldValueMixin');

/**
 * Date input component
 * @module Date Date component
 */
module.exports = React.createClass({

  displayName: 'Date',

  mixins: [ValueChangeMixin, FieldValueMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    time: React.PropTypes.bool,
    format: React.PropTypes.string,
    parse: React.PropTypes.string,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps: function(){
    return {
      inputProps: ['id', 'name', 'time', 'format', 'parse', 'aria-describedby'],
      time: false,
      format: 'MM/dd/yyyy',
      parse: 'MM/dd/yyyy'
    };
  },

  getInitialState: function(){
    return {
      value: this.props.value ? new Date(this.props.value) : null
    };
  },

  handleDateChange : function(date, dateString){
    this.onChange({ target: { value: date }});
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    return <DateTimePicker {...props}  onChange={this.handleDateChange} value={this.state.value}  />;
  }

});
