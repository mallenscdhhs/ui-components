var React = require('react');
var Flux = require('fluxify');
var constants = require('./constants');
var _ = require('lodash');

/**
 * Provides a default onChange handler for Field.
 * @module ValueChangeMixin
 */
module.exports = {
  /**
   * Handles the onChange event for an input component. You may customize the functionality
   * of this method by passing in extra configuration data on the event object.
   * @fires FIELD_VALUE_CHANGE
   * @param {object} event - { target: ..., actionName: String, stateChange: Object }
   */
  onChange: function(event){
    var actionName = event.actionName || constants.actions.FIELD_VALUE_CHANGE;
    var state = event.stateChange || {value: event.target.value};
    var payload = _.pick(this.props, ['id', 'name', 'rules', 'type','maxLength','required','persistInSession']);
    payload.value = event.target.value;
    this.setState(state);
    Flux.doAction(actionName, payload);
  }
};
