'use-strict';
import React from 'react';
import { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import Immutable from 'immutable';
import _ from 'lodash';

let { FIELD_BLUR } = constants.actions;

/**
 * Provides a default onChange handler for Field.
 * @module ValueChangeMixin
 */
export default {
  /**
   * Handles the onChange event for an input component. You may customize the functionality
   * of this method by passing in extra configuration data on the event object.
   * @fires FIELD_VALUE_CHANGE
   * @param {object} event - { target: ..., actionName: String, stateChange: Object }
   * @param {boolean} fieldValueChangeAction - optionally pass in to use custom onChange
   * action name rather than the default FIELD_VALUE_CHANGE action.
   */
  onChange(event) {
    let actionName = this.props.fieldValueChangeAction || event.actionName || constants.actions.FIELD_VALUE_CHANGE;
    let state = event.stateChange || {value: event.target.value};
    let payload = Immutable.fromJS(this.props).withMutations((mutablePayload) => {
      mutablePayload
        .set('visible', this.state.visible)
        .set('disabled', this.state.disabled);
      if (this.props.mask) {
        mutablePayload
          .set('value', state.unmasked)
          .set('masked', state.value);
      } else {
        mutablePayload.set('value', event.target.value);
        if (event.target.dateString) {
          mutablePayload.set('dateString', event.target.dateString);
        }
      }
    });

    this.setState(state);
    Dispatcher.dispatch(actionName, payload.toJSON());
  },

  /**
   * Handles the onBlur event of a Field and sends the Field's data in an action
   * call. The ValidationStore has a handler for the FIELD_BLUR action and performs
   * validation when called.
   * @fires FIELD_BLUR
   */
  onBlur(event) {
    let payload = Immutable.fromJS(this.props).withMutations((mutablePayload) => {
      if (this.props.mask) {
        mutablePayload
          .set('value', this.state.unmasked)
          .set('masked', this.state.value);
      } else {
        mutablePayload.set('value', this.state.value);
      }
    });
    Dispatcher.dispatch(FIELD_BLUR, payload.toJSON());
  }
};
