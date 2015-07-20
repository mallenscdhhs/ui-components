'use-strict';
import React from 'react';
import _ from 'lodash';
import { DateTimePicker } from 'react-widgets';
import ValueChangeMixin from './ValueChangeMixin';

/**
 * Date input component
 * @module Date Date component
 */
export default React.createClass({

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

  getDefaultProps() {
    return {
      inputProps: ['id', 'name', 'calendar', 'time', 'format', 'parse', 'aria-describedby', 'placeholder', 'visible', 'disabled'],
      calendar: true,
      time: false,
      format: 'MM/dd/yyyy',
      parse: 'MM/dd/yyyy'
    };
  },

  /**
   * Populate the default value of the Date component with either today's date,
   * a specific date, or render it empty.
   * @param {string} today - results in populating with today's date
   * @param {string} format - if this.props.value is supplied, and not 'today',
   * you can provide any other date in the format corresponding to the pattern
   * passed into this.props.format
   */
  getInitialState() {
    return this.props.value === 'today' ? (
      {value: new Date()}
    ) : (
      {value: this.props.value ? new Date(this.props.value) : null}
    );
  },

  handleDateChange(date, dateString) {
    this.onChange({ target: {value: date, dateString: dateString}});
  },

  render() {
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
