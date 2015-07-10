'use-strict';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import configuration from './configuration';
import _ from 'lodash';

let {
  LOAD_OPTIONS,
  API_COMMUNCATION_ERROR,
  SEND_RESOURCE_OPTIONS
} = constants.actions;

/**
 * Responsible for fetching and returning option data.
 * @module OptionsStore
 */
export default Flux.createStore({

  id: 'OptionsStore',

  actionCallbacks: {
    /**
     * Calls an API to retrieve options data. Optionally filters data with passed
     * in resourceFilter param.
     * @fires LOAD_OPTIONS, API_COMMUNCATION_ERROR
     * @param {object} data
     */
    [SEND_RESOURCE_OPTIONS](updater, data) {
      if ( !configuration.API || !configuration.API.options ) {
        throw new Error('API endpoint for options not configured.');
      }

      let uri = `${configuration.API.options}/${data.resourceName}`;
      let params = {filter: data.resourceFilter};
      let request = $.getJSON(uri, params);

      request.done(resp => {
        let options = [];
        let id = data.fieldId;
        if (resp && resp.responsePayload.result.length) {
          options = resp.responsePayload.result;
        }
        Dispatcher.dispatch(LOAD_OPTIONS, {id, options});
      });

      request.fail((jqxhr, textStatus, error) => {
        Dispatcher.dispatch(
          API_COMMUNCATION_ERROR,
          _.merge(data, {
            hasError: true,
            errorMessage: 'Error calling options API.'
          })
        );
      });
    }
  }
});
