'use-strict';
var React = require('react');
var FieldLabel = require('./FieldLabel');
var _ = require('lodash');
var constants = require('./constants');
var ValueChangeMixin = require('./ValueChangeMixin');

/**
 * Renders either a radio|checkbox input control.
 * @module Checkable
 */
module.exports = React.createClass({

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
    checked: React.PropTypes.bool,
    helpText: React.PropTypes.string,
    required: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      componentType: 'field',
      inputProps: ['type', 'id', 'name', 'checked', 'value', 'disabled', 'aria-describedby'],
      labelProps: ['label', 'id', 'required']
    };
  },

  getInitialState: function(){
    return {
      'checked' : false
    };
  },

  /**
   * Because radios and checkboxes only submit their value if they are checked,
   * we must inspect the "checked" state of the input and choose whether or not
   * to send its value. Also, we may need to fire FIELD_GROUP_VALUE_CHANGE if this
   * input is part of a FieldGroup.
   * @param {object} e - event object
   * @fires FIELD_VALUE_CHANGE | FIELD_GROUP_VALUE_CHANGE
   */
  handleChange: function(e){
    var value = e.target.checked? this.props.value : null;
    var stateChange = { checked: e.target.checked };
    var action = this.props.isFieldGroup ? constants.actions.FIELD_GROUP_VALUE_CHANGE : constants.actions.FIELD_VALUE_CHANGE;
    this.onChange({
      target: { value: value },
      stateChange: { checked: e.target.checked },
      actionName: action
    });
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    var labelProps = _.pick(this.props, this.props.labelProps);
    return (
      <div className={this.props.type}>
        <FieldLabel {...labelProps}>
          <input {...props} onChange={this.handleChange}/>
        </FieldLabel>
      </div>
    );
  }
});
