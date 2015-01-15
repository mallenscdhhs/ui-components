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

      // Session Data Callback
      // When Session data has been gathered, will fire this event, and
      // 'session' will be the array of session objects
      Dispatcher.register(data.id + '-VALIDATION-STORE',function(action,session){
        if(action === constants.actions.SESSION_VALUES_LOADED) {
          // Verify API has validation endpoint
          if (configuration.API && configuration.API.validation) {
            // Build Request Payload
            var field = {};
            field[data.name] = data.value;
            var requestPayload = {
              "payload": {
                "rules"      : data.rules,
                "sessionData": session,
                "input"      : [field]
              }
            };
            // Call Validation API with payload
            $.post(configuration.API.validation, requestPayload)
              .done(function (resp) {
                // Successful call, prepare resp to UI
                var hasError = false;
                var errorMessage = '';
                if (resp.operationStatus === 'FAILURE') {
                  hasError = true;
                  var errorsMgs = [];
                  _.each(resp.errors,function(err){
                    errorsMgs.push(err.errorDesc);
                  });
                  errorMessage = errorsMgs.join('');
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
                  constants.actions.FIELD_VALIDATION_ERROR ,
                  _.merge(data,{'hasError' : true , 'errorMessage' : 'Unable to call validation rules API.'})
                );
              });
          }else{
            throw new Error('API Endpoints not configured.');
          }
          Dispatcher.unregister(data.id + '-VALIDATION-STORE' );
        }
      });

      Flux.doAction(constants.actions.GET_SESSION_VALUES);

    }

  }
});