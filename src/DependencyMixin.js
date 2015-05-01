var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var React = require('react');
var _ = require('lodash');
var utils = require('./utils');

/**
 * DependencyMixin which manages visibility state based on component's dependent field value
 * @module DependencyMixin
 */
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
   * Init visible state, based on initialState
   */
  componentWillMount: function() {
    this.setState({ 'visible': this.props.initialState !== 'hidden'});
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
        if( _.includes([constants.actions.FIELD_VALUE_CHANGE,constants.actions.FIELD_VALUE],action) &&
          data.name === depName){
          var value = _.isArray(data.value)? data.value : [data.value];
          var visibility = (utils.containsOneOf(depValues, value))? !visible : visible;
          this.setState({'visible': visibility});
          Flux.doAction(constants.actions.COMPONENT_VISIBILITY,this.props,visibility);
        }
      }.bind(this));

      // Request inital value for dependent field
      Flux.doAction(constants.actions.GET_FIELD_VALUE, {
        'name' : depName
      });
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
