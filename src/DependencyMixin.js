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
      var visible = this.state.visible;
      var depName = this.props.dependencyName;
      var depValues = this.props.dependencyValue.split('|');

      Dispatcher.register( this.props.id + '-DEP-CHANGE' , function(action,data){
        if( action === constants.actions.FIELD_VALUE_CHANGE && data.name === depName){
          var visibility = (depValues.indexOf(data.value) >= 0)? !visible : visible;
          this.setState({'visible': visibility});
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
