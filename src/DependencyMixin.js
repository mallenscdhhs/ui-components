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
    dependencyType: React.PropTypes.string,
    initialState: React.PropTypes.oneOf(['hidden', 'visible','enabled','disabled'])
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
    this.setState({
      'visible': this.props.initialState !== 'hidden',
      'disabled': this.props.initialState === 'disabled'
    });
  },

  /**
   * Upon mounting, subscribe to any dependency that the field has, and monitor the field
   * for events that would require you to make a state change.
   */
  componentDidMount: function(){
    if(this.hasDependency()){
      var visible = this.state.visible;
      var disabled = this.state.disabled;
      var depName = this.props.dependencyName;
      var depType = _.includes(['enabled','disabled'],this.props.initialState) ? 'enablement' : 'visibility';
      var depValues = this.props.dependencyValue.split('|');

      Dispatcher.register( this.props.id + '-DEP-CHANGE' , (action,data)=>{
        if( _.includes([constants.actions.FIELD_VALUE_CHANGE,constants.actions.FIELD_VALUE,constants.actions.ENTRYLIST_FIELD_VALUE_CHANGE],action) &&
          data.name === depName){
          var value = _.isArray(data.value)? data.value : [data.value];
          var changeState = utils.containsOneOf(depValues, value);
          if(depType === 'enablement'){
            // Update DISABLE
            var disabledState = changeState ? !disabled : disabled;
            this.setState({'disabled': disabledState});
          }else {
            // Update VISIBLE
            var visibility = changeState ? !visible : visible;
            this.setState({'visible': visibility});
            Flux.doAction(constants.actions.COMPONENT_VISIBILITY, this.props, visibility);
          }
        }
      });

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
