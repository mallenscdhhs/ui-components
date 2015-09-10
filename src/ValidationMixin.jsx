var React = require('react');
var Dispatcher = require('fluxify').dispatcher;
var constants = require('./constants');

module.exports = {

  componentDidMount: function(){
    Dispatcher.register( this.props.id + '-VALIDATE-FIELD' , function(action,data){
      if( action === constants.actions.FIELD_VALIDATION_ERROR &&
          data.id === this.props.id) {
        this.setState({'hasError': data.hasError, 'errorMessage': data.errorMessage, 'value': data.value});
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-VALIDATE-FIELD');
  }

};
