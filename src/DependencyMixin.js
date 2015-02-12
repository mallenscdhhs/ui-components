var Dispatcher = require('fluxify').dispatcher;
var constants = require('./constants');
var React = require('react');

module.exports = {

  propTypes: {
    dependencyName: React.PropTypes.string,
    dependencyValue: React.PropTypes.string,
    initialState: React.PropTypes.oneOf(['hidden', 'visible'])
  },

  /**
   * Determine if this field has a configured dependency
   * @returns {boolean}
   */
  hasDependency: function(){
    return !!this.props.dependencyName;
  },

  /**
   * Upon mounting, subscribe to any dependency that the field has, and monitor the field
   * for events that would require you to make a state change.
   */
  componentDidMount: function(){
    if(this.hasDependency()){
      var initState = this.props.initialState !== 'hidden';
      var depName = this.props.dependencyName;
      var depValues = this.props.dependencyValue.split('|');

      Dispatcher.register( this.props.id + '-DEP-CHANGE' , function(action,data){
        if( action === constants.actions.FIELD_VALUE_CHANGE && data.name === depName){
          if(depValues.indexOf(data.value) >= 0) {
            // Change from initial display state.
            this.setState({'display': !initState});
          }else{
            // Otherwise, revert to (or stay at) initState
            this.setState({'display': initState});
          }
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
