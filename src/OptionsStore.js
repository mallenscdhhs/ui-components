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

  actionCallbacks: {

    "sendResourceOptions" : function(updater,data){
      if ( !configuration.API || !configuration.API.options ) throw new Error('API endpoint for options not configured.');
      $.getJSON(configuration.API.options+'/'+data.resourceName)
        .done(function (resp) {
          var options = [];
          if (resp && resp.responsePayload.result.length) {
            options = resp.responsePayload.result;
          }
          Flux.doAction(constants.actions.LOAD_OPTIONS, {
            'id': data.fieldId,
            'options' : options
          });
        })
        .fail(function () {
          Flux.doAction(
            constants.actions.API_COMMUNCATION_ERROR,
            _.merge(data, {'hasError': true, 'errorMessage': 'Error calling options API.'})
          );
        });
    }

  }
});