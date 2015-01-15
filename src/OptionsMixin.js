var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');

module.exports = {

  propTypes: {
    options: React.PropTypes.shape({
      items: React.PropTypes.arrayOf(React.PropTypes.object),
      name: React.PropTypes.string
    }).isRequired
  },

  /**
   * Set the options state for this field.
   * @param {array} data - an array of option configs
   */
  updateOptions: function(data){
    this.setState({ options: data });
  },

  /**
   * Load in the options state either from config props or
   * ask the parent app to load them from the server.
   * @fires field:mount:{id}
   */
  componentDidMount: function(){
    if ( this.props.options.items ) {
      this.setState({options: this.props.options.items});
    } else {
      Dispatcher.register( this.props.id + '-LOAD-OPTIONS' , function(action,data){
        if( action === constants.actions.LOAD_OPTIONS &&
            data.id === this.props.id) {
          this.updateOptions(data);
        }
      }.bind(this));
      var eventData = {
        'resourceName' : this.props.options.name,
        'fieldId' : this.props.id
      };
      Flux.doAction( constants.actions.SEND_OPTIONS , eventData );
    }
  },

  /**
   * Remove all event listeners.
   */
  componentWillUnmount: function(){
    if ( !this.props.options.items ) {
      Dispatcher.unregister( this.props.id + '-LOAD-OPTIONS');
    }
  }
};
