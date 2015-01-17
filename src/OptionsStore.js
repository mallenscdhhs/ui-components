var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var configuration = require('./configuration');
var _ = require('lodash');

/**
 * Responsible for fetching and returning option data.
 * @module OptionsStore
 */
module.exports = Flux.createStore({

  id: 'OptionsStore',

  initialState : {

  },

  actionCallbacks: {

    "sendResourceOptions" : function(updater,data){
      if (configuration.API && configuration.API.options) {
        var requestPayload = {
          "payload": {
            "fieldId": data.fieldId,
            "resourceName" : data.resourceName
          }
        };
        $.post(configuration.API.options, requestPayload)
          .done(function (resp) {
            var options = [];
            if (resp && resp.length) {
              options = resp;
            }
            Flux.doAction(constants.actions.LOAD_OPTIONS, options);
          })
          .fail(function () {
            Flux.doAction(
              constants.actions.API_COMMUNCATION_ERROR,
              _.merge(data, {'hasError': true, 'errorMessage': 'Error calling options API.'})
            );
          });
      }else{
        throw new Error('API endpoint for options not configured.');
      }
    }

  }
});