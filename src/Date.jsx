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
      value: this.props.value ? new Date(this.props.value) : null
    };
  },

  handleDateChange : function(date,dateString){
    this.setState({value: date});
    var eventData = {
      id: this.props.id,
      name: this.props.name,
      value: event.target.value,
      type: this.props.type,
      rules : this.props.rules
    };
    console.log(eventData);
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return <DateTimePicker time={false} onChange={this.handleDateChange} value={this.state.value} {...props} />;
  }

});
