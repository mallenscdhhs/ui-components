'use-strict';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
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
    this.handleDateChange = this.handleDateChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
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
