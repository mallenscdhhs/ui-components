'use-strict';
import React from 'react';
import _ from 'lodash';
import { DateTimePicker } from 'react-widgets';
import utils from './utils';

/**
 * Date input component
 * @module DateField Date component
 */
class DateField extends React.Component {

  static getDateValue(input) {
    let value = null;
    if (input === 'today') {
      value = new Date();
    } else if (input) {
      value = new Date(input);
    }
    return value;
  }

  componentDidMount() {
    let dateString = utils.getDateString(this.props.value);
    this.onChange({target: {value: this.props.value, dateString}});
  }

  handleDateChange(date, dateString) {
    this.onChange({target: {value: date, dateString: dateString}});
  }

  render() {
    let props = _.pick(this.props, this.props.inputProps);
    return (
      <DateTimePicker
        onChange={this.handleDateChange}
        onBlur={this.onBlur}
        value={this.props.value}
        {...props} />
    );
  }
};

DateField.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  calendar: React.PropTypes.bool,
  time: React.PropTypes.bool,
  format: React.PropTypes.string,
  parse: React.PropTypes.string,
  inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
};

DateField.defaultProps = {
  componentType: 'date',
  inputProps: ['id', 'name', 'calendar', 'time', 'format', 'parse', 'aria-describedby', 'placeholder', 'visible', 'disabled'],
  calendar: true,
  time: false,
  format: 'MM/dd/yyyy',
  parse: 'MM/dd/yyyy'
};

export default DateField;
