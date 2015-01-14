var Dispatcher = require('fluxify').dispatcher;
var constants = require('./constants');

module.exports = {

  /**
   * Determine if this field has a configured dependency
   * @returns {boolean}
   */
  hasDependency: function(){
    return !!this.props.dependency;
  },

  /**
   * Upon mounting, subscribe to any dependency that the field has, and monitor the field
   * for events that would require you to make a state change.
   */
  componentDidMount: function(){    
    if(this.hasDependency()){      
      var initState = this.props.dependency.initialState !== 'hidden';
      var depName = this.props.dependency.id;
      var depValues = this.props.dependency.value.split('|');

      Dispatcher.register( this.props.id + '-DEP-CHANGE' , function(payload){
        if( payload.actionType === constants.actions.FIELD_VALUE_CHANGE &&
            payload.data.id === depName &&
            depValues.indexOf(payload.data.value) >= 0) {
          // Change from initial display state.
          this.setState({'display': !initState});
        }else{
          // Otherwise, revert to (or stay at) initState
          this.setState({'display': initState});
        }
      }.bind(this));
    }
  },

  /**
   * UnSubscribe from any dependent field events that the current field was listening to.
   * @returns {void}
   */
  componentWillUnmount: function(){
    if(this.hasDependency()){
      Dispatcher.unregister( this.props.id + '-DEP-CHANGE' );
    }
  }  

};