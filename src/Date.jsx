'use-strict';
import React from 'react';
import _ from 'lodash';
import {DateTimePicker} from 'react-widgets';

/**
 * Date input component
 * @module DateField Date component
 */
class DateField extends React.Component {

  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleManualChange = this.handleManualChange.bind(this);
  }

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
    let _div = React.findDOMNode(this);
    _div.addEventListener('change', this.handleManualChange);
  }

  componentWillUnmount() {
    let _div = React.findDOMNode(this);
    _div.removeEventListener('change', this.handleManualChange);
  }

  handleDateChange(date, dateString) {
    let _div = React.findDOMNode(this);
    let event = new Event('change', {bubbles: true});
    event.date = date;
    event.dateString = dateString;
    _div.dispatchEvent(event);
  }

  handleManualChange(e) {
    let value = {date: _.clone(e.date), dateString: _.clone(e.dateString)};
    e.component = {
      id: this.props.id,
      schemaUpdates: this.props,
      modelUpdates: {
        id: this.props.name,
        value
      }
    };
  }

  render() {
    return (
      <div>
        <DateTimePicker
          {...this.props}
          onChange={this.handleDateChange}
          value={DateField.getDateValue(this.props.value)}/>
      </div>
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
