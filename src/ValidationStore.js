var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var configuration = require('./configuration');
var _ = require('lodash');

module.exports = Flux.createStore({

  id: 'ValidationStore',

  initialState : {

  },

  actionCallbacks: {

    /**
     * Initiate Validation Process using field data
     * Do not kick off validation if field is disabled or not visible
     * @param updater {function} Method to update store
     * @param data {object} Field props
     */
    fieldValueChange : _.debounce(function (updater, data) {
      var visible = data.visible !== 'hidden';
      var enabled = !data.disabled;
      if(visible && enabled) {
        Flux.doAction(constants.actions.GET_SESSION_VALUES, data);
      }
    }, 500),

    /**
     * Initiate Validation Process using when user blurs a field in order to
     * prevent a user from "skipping" a required field.
     * @param updater {function} Method to update store
     * @param data {object} Field props
     */
    blurField: function(updater, data){
      Flux.doAction(constants.actions.GET_SESSION_VALUES, data);
    },

    /**
     * Session Data Callback
     * When Session data has been gathered, will fire this event, and
     * 'session' will be the array of session objects, 'data' is the pass through
     * from the GET_SESSION_VALUES above
     * @param updater
     * @param session
     * @param data
     */
    sessionValuesLoaded : function(updater,session,data){
      // Verify API has validation endpoint AND has rules associated with the field
      if ( ! (configuration.API && configuration.API.validation) ) throw new Error('API endpoint for validation not configured.');
      if ( data.rules ) {
        // Build Request Payload
        var field = _.zipObject([data.name], [data.value]);
        var requestPayload = {
          "input": field,
          "rules": _.compact(_.map(data.rules, function(enabled, name){
            return !enabled ? null : {
              "ruleName": name,
              "config": _.pick(data, ['type', 'name', 'id', 'maxLength', 'required'])
            };
          })),
          "sessionData": session
        };
        // Call Validation API with payload
        $.ajax({
          url: configuration.API.validation,
          type: 'POST',
          data: JSON.stringify(requestPayload),
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8'
        })
          .done(function (resp) {
            // Successful call, prepare resp to UI
            var hasError = false;
            var errorMessage = '';
            if (resp.operationStatus === 'FAILURE') {
              hasError = true;
              errorMessage = _.map(resp.operationMessages, function(msg){
                return msg.description;
              }).join('<br>');
            }
            // Update Component by setting the validation error indicator 'hasError' and 'errorMessage',
            // using the FIELD_VALIDATION_ERROR event
            Flux.doAction(
              constants.actions.FIELD_VALIDATION_ERROR ,
              _.merge(data, {'hasError' : hasError , 'errorMessage' : errorMessage})
            );
          })
          .fail(function(){
            // Error reaching API endpoint, throw generic error
            Flux.doAction(
              constants.actions.API_COMMUNCATION_ERROR ,
              _.merge(data,{'hasError' : true , 'errorMessage' : 'Error calling validation API.'})
            );
          });
      }
    }

  }
});
