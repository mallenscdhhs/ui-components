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
     * @param updater {function} Method to update store
     * @param data {object} Field props
     */
    "fieldValueChange" : function (updater, data) {
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
    "sessionValuesLoaded" : function(updater,session,data){
      // Verify API has validation endpoint
      if (configuration.API && configuration.API.validation) {
        // Build Request Payload
        var field = _.zipObject([data.name], [data.value]);
        var requestPayload = {
          "input"      : field,
          "rules"      : _.map(data.rules, function(rule){
            return {
              "ruleName": rule,
              "config": _.pick(data, ['type', 'name', 'id', 'maxLength', 'required'])
            };
          }),
          "sessionData": session
        };
        // Call Validation API with payload
        $.post(configuration.API.validation, requestPayload)
          .done(function (resp) {
            // Successful call, prepare resp to UI
            var hasError = false;
            var errorMessage = '';
            if (resp.operationStatus === 'FAILURE') {
              hasError = true;
              errorMessage = _.map(resp.errors,function(err){
                return err.errorDesc;
              }).join('<br>');
            }
            // Update Component by setting the validation error indicator 'hasError' and 'errorMessage',
            // using the FIELD_VALIDATION_ERROR event
            Flux.doAction(
              constants.actions.FIELD_VALIDATION_ERROR ,
              _.merge(data,{'hasError' : hasError , 'errorMessage' : errorMessage})
            );
          })
          .fail(function(){
            // Error reaching API endpoint, throw generic error
            Flux.doAction(
              constants.actions.API_COMMUNCATION_ERROR ,
              _.merge(data,{'hasError' : true , 'errorMessage' : 'Error calling validation API.'})
            );
          });
      }else{
        throw new Error('API endpoint for validation not configured.');
      }
    }

  }
});