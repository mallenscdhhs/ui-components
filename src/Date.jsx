'use-strict';
var React = require('react');
var FieldMixin = require('./FieldMixin');
var _ = require('lodash');
var inputProps = ['id', 'name', 'aria-describedby'];
var DateTimePicker = require('react-widgets').DateTimePicker;
var Flux = require('fluxify');
var constants = require('./constants');

/**
 * Date input component
 * @module Date Date component
 */
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
      value: date,
      type: this.props.type,
      rules : this.props.rules
    };
    Flux.doAction( constants.actions.FIELD_VALUE_CHANGE ,  eventData  );
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return <DateTimePicker time={false} format={"M/d/yyyy"} parse={"M/d/yyyy"} onChange={this.handleDateChange} {...props} value={this.state.value}  />;
  }

});
