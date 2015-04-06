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
    // if a client is sending us new options...
    Dispatcher.register(this.props.id + '-LOAD-OPTIONS', function (action, data) {
      if (action === constants.actions.LOAD_OPTIONS &&
          data.id === this.props.id) {
        this.setState({'options': data.options});
      }
    }.bind(this));

    this.initOptions(this.props);
  },

  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-LOAD-OPTIONS');
  },

  componentWillReceiveProps: function(nextProps){
    this.initOptions(nextProps);
  },

  initOptions: function(props){
    if ( props.options ) {
      this.setState({'options': props.options});
    } else if ( props.optionsResource ) {
      Flux.doAction(constants.actions.SEND_RESOURCE_OPTIONS, {
        'resourceName': props.optionsResource,
        'fieldId' : props.id,
        'fieldName' : props.name
      });
    }else{
      Flux.doAction(constants.actions.SEND_OPTIONS, props);
    }
  }
};
