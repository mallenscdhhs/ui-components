'use-strict';
import React from 'react';
import _ from 'lodash';
import {DateTimePicker} from 'react-widgets';
import {Input} from 'react-bootstrap';

/**
 * Date input component
 * @module DateField Date component
 */
class DateField extends React.Component {

  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
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

  handleDateChange(date, value) {
    let node = React.findDOMNode(this);
    let event = new Event('change', {bubbles: true});
    event.component = {
      id: this.props.id,
      props: _.omit(this.props, 'schema'),
      modelUpdates: {
        id: this.props.name,
        value
      }
    };

    node.dispatchEvent(event);
  }

  render() {
    return (
      <Input label={this.props.label} help={this.props.help} bsStyle={this.props.bsStyle}>
        <DateTimePicker
          {...this.props}
          onChange={this.handleDateChange}
          value={DateField.getDateValue(this.props.value)}/>
      </Input>
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
  parse: React.PropTypes.string
};

DateField.defaultProps = {
  componentType: 'date',
  calendar: true,
  time: false,
  format: 'MM/dd/yyyy',
  parse: 'MM/dd/yyyy'
};

export default DateField;
