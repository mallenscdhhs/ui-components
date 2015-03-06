var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
/**
 * Manages component options
 * @module OptionsMixins
 * @type {{propTypes: {options: (isRequired|*)}, componentDidMount: Function, componentWillUnmount: Function}}
 */
module.exports = {

  propTypes: {
    options: React.PropTypes.arrayOf(React.PropTypes.object),
    optionsResource: React.PropTypes.string,
    optionsDependencyName: React.PropTypes.string
  },

  /**
   * Load in the options state either from config props or
   * ask the parent app to load them from the server.
   * @fires SEND_RESOURCE_OPTIONS
   */
  componentDidMount: function(){
    // Register LOAD_OPTIONS callback
    Dispatcher.register(this.props.id + '-LOAD-OPTIONS', function (action, data) {
      if (action === constants.actions.LOAD_OPTIONS &&
          data.id === this.props.id) {
        this.setState({'options': data.options});
      }
    }.bind(this));

    // Init Options
    if ( this.props.options ) {
      this.setState({'options': this.props.options});
    } else if ( this.props.optionsResource ) {
      Flux.doAction(constants.actions.SEND_RESOURCE_OPTIONS, {
        'resourceName': this.props.optionsResource,
        'fieldId' : this.props.id,
        'fieldName' : this.props.name
      });
    }else{
      Flux.doAction(constants.actions.SEND_OPTIONS, this.props);
    }
  },

  /**
   * Remove all event listeners.
   */
  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-LOAD-OPTIONS');
  }
};
