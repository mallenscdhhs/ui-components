'use-strict';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import masker from './input-masker';
import {Input} from 'react-bootstrap';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Globalize from 'globalize';
import globalizeLocalizer from 'react-widgets/lib/localizers/globalize';

/**
 * i18N support, now required by react-widgets v3.x
 */
globalizeLocalizer(Globalize);

/**
 * Date input component
 * @module DateField Date component
 */
class DateField extends React.Component {

  constructor(props) {
    super(props);
    this._handleDateChange = this._handleDateChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
  }

  /**
   * Parse the initial Field value for use with react-widgets DateTimePicker.
   * @param {string} value - the initial prop value
   * @returns {Date?} Date or null
   */
  static getDateValue(value) {
    let dateValue = null;
    if (value === 'today') {
      dateValue = new Date();
    } else if (value) {
      dateValue = new Date(value);
    }

    return dateValue;
  }

  /**
   * Parse user input as Date object.
   * @param {string} str - user input
   * @returns {Date}
   */
  static parseDate(str) {
    let date = new Date(str);
    if (date.toString() === 'Invalid Date') {
      let maskedDate = masker.mask('date', str);
      date = new Date(maskedDate);
    }

    return date;
  }

  _handleDateChange(date, value) {
    let node = ReactDOM.findDOMNode(this);
    let event;
    try {
      event = new Event('change', {bubbles: true});
    } catch (e) {
      event = document.createEvent('Event');
      event.initEvent('change', true, false);
    }

    event.component = {
      id: this.props.id,
      props: _.omit(this.props, 'schema'),
      modelUpdates: {
        [this.props.name]: value
      }
    };

    node.dispatchEvent(event);
  }

  _handleBlur(e) {
    e.component = this.props;
  }

  render() {
    let wrapperProps = _.pick(this.props, ['bsStyle', 'label', 'help']);
    return (
      <Input {...wrapperProps}>
        <DateTimePicker
          {...this.props}
          onBlur={this._handleBlur}
          onChange={this._handleDateChange}
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
  format: React.PropTypes.string
};

DateField.defaultProps = {
  componentType: 'date',
  calendar: true,
  time: false,
  format: 'MM/dd/yyyy',
  parse: DateField.parseDate,
  help: 'Date format: MM/dd/yyyy'
};

export default DateField;
