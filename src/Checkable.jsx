'use-strict';
import React from 'react';
import FieldLabel from './FieldLabel';
import _ from 'lodash';
import constants from './constants';
import ValueChangeMixin from './ValueChangeMixin';

let {
  FIELD_VALUE_CHANGE,
  FIELD_GROUP_VALUE_CHANGE
} = constants.actions;

/**
 * Renders either a radio|checkbox input control.
 * @module Checkable
 */
export default React.createClass({

  displayName: 'Checkable',

  mixins: [ValueChangeMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.bool
    ]).isRequired,
    disabled: React.PropTypes.bool,
    isFieldGroup: React.PropTypes.bool,
    inline: React.PropTypes.bool,
    checked: React.PropTypes.bool,
    helpText: React.PropTypes.string,
    required: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      componentType: 'field',
      inline: true,
      inputProps: ['type', 'id', 'name', 'value', 'disabled', 'checked', 'aria-describedby'],
      labelProps: ['label', 'id', 'required']
    };
  },

  componentWillMount() {
    let checked = !!this.props.checked;
    this.setState({checked});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('checked')) {
      let checked = !!nextProps.checked;
      this.setState({checked});
    }
  },

  /**
   * Because radios and checkboxes only submit their value if they are checked,
   * we must inspect the "checked" state of the input and choose whether or not
   * to send its value. Also, we may need to fire FIELD_GROUP_VALUE_CHANGE if this
   * input is part of a FieldGroup.
   * @param {object} e - event object
   * @fires FIELD_VALUE_CHANGE | FIELD_GROUP_VALUE_CHANGE
   */
  handleChange(e) {
    let value = e.target.checked? this.props.value : null;
    let action = this.props.isFieldGroup ? FIELD_GROUP_VALUE_CHANGE : FIELD_VALUE_CHANGE;
    this.onChange({
      target: {value: value},
      stateChange: {checked: e.target.checked},
      actionName: action
    });
  },

  render() {
    let props = _.pick(this.props, this.props.inputProps);
    let labelProps = _.pick(this.props, this.props.labelProps);
    let className = this.props.type;
    if (this.props.inline) {
      className += '-inline';
    }
    return (
      <div className={className}>
        <FieldLabel {...labelProps}>
          <input
            checked={this.state.checked}
            onChange={this.handleChange}
            onBlur={this.onBlur}
            {...props} />
        </FieldLabel>
      </div>
    );
  }
});
