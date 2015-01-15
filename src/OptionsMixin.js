var React = require('react');
var Dispatcher = require('fluxify').dispatcher;
var constants = require('./constants');

module.exports = {

  propTypes: {
    options: React.PropTypes.shape({
      items: React.PropTypes.arrayOf(React.PropTypes.object),
      name: React.PropTypes.string
    }).isRequired
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
      Dispatcher.register( this.props.id + '-LOAD-OPTIONS' , function(payload){
        if( payload.actionType === constants.actions.LOAD_OPTIONS &&
            payload.data.id === this.props.id) {
          this.setState({options: payload.data.options});
        }
      }.bind(this));
      var eventData = {
        'resourceName' : this.props.options.name,
        'fieldId' : this.props.id
      };
      Dispatcher.dispatch( { 'actionType' : constants.actions.SEND_OPTIONS , 'data' : eventData } );
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
