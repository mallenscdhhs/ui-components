'use-strict';
import React from 'react';
import _ from 'lodash';
import { DateTimePicker } from 'react-widgets';
import ValueChangeMixin from './ValueChangeMixin';

/**
 * Date input component
 * @module Date Date component
 */
module.exports = React.createClass({

  displayName: 'Date',

  mixins: [ValueChangeMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    calendar: React.PropTypes.bool,
    time: React.PropTypes.bool,
    format: React.PropTypes.string,
    parse: React.PropTypes.string,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getDefaultProps: function(){
    return {
      inputProps: ['id', 'name', 'calendar', 'time', 'format', 'parse', 'aria-describedby'],
      calendar: true,
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
    this.onChange({ target: {value: date, dateString: dateString}});
  },

  render: function(){
    let props = _.pick(this.props, this.props.inputProps);
    return (
      <DateTimePicker
        onChange={this.handleDateChange}
        onBlur={this.onBlur}
        value={this.state.value}
        {...props} />
    );
  }

});
