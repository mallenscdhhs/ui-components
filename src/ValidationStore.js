'use-strict';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import configuration from './configuration';
import _ from 'lodash';

let {
  FIELD_VALUE_CHANGE,
  FIELD_BLUR,
  SESSION_VALUES_LOADED,
  GET_SESSION_VALUES,
  FIELD_VALIDATION_ERROR
} = constants.actions;

export default Flux.createStore({
  id: 'ValidationStore',
  actionCallbacks: {
    /**
     * Initiate Validation Process using field data once every 500ms.
     * Do not kick off validation if field is disabled or not visible
     * @param updater {function} Method to update store
     * @param data {object} Field props
     */
    [FIELD_VALUE_CHANGE]: _.debounce((updater, data) => {
      let visible = (data.visible !== 'hidden');
      let enabled = !data.disabled;
      if (visible && enabled) {
        Dispatcher.dispatch(GET_SESSION_VALUES, data);
      }
    }, 500),

    /**
     * Initiate Validation Process when user blurs a field in order to
     * prevent a user from "skipping" a required field.
     * @param updater {function} Method to update store
     * @param data {object} Field props
     */
    [FIELD_BLUR](updater, data) {
      Dispatcher.dispatch(GET_SESSION_VALUES, data);
    },

    /**
     * Session Data Callback
     * When Session data has been gathered call the validation API endpoint.
     * @param {object} updater
     * @param {object} sessionData
     * @param {object} data - field props
     */
    [SESSION_VALUES_LOADED](updater, sessionData, data) {
      // Verify API has validation endpoint AND has rules associated with the field
      if (!(configuration.API && configuration.API.validation)) throw new Error('API endpoint for validation not configured.');
      if (data.rules) {
        let input = {[data.name]: data.value || ''};
        let requestPayload = {
          input,
          sessionData,
          rules: _.compact(_.map(data.rules, (enabled, ruleName) => {
            return !enabled ? null : {
              ruleName,
              config: _.pick(data, ['type', 'name', 'id', 'maxLength', 'required'])
            };
          }))
        };

        // Call Validation API with payload
        let request = $.ajax({
          url: configuration.API.validation,
          type: 'POST',
          data: JSON.stringify(requestPayload),
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8'
        });

        request.done((resp) => {
          let hasError = false;
          let errorMessage = '';
          if (resp.operationStatus === 'FAILURE') {
            hasError = true;
            errorMessage = _.map(resp.operationMessages, msg => msg.description).join('<br>');
          }

          // Update Component by setting the validation error indicator 'hasError' and 'errorMessage',
          // using the FIELD_VALIDATION_ERROR event
          Dispatcher.dispatch(
            FIELD_VALIDATION_ERROR ,
            _.merge(data, {hasError: hasError, errorMessage: errorMessage})
          );
        });

        // Error reaching API endpoint, throw generic error
        request.fail(() => {
          Dispatcher.dispatch(
            API_COMMUNCATION_ERROR ,
            _.merge(data, {hasError: true , errorMessage: 'Error calling validation API.'})
          );
        });
      }
    }

  }
});
