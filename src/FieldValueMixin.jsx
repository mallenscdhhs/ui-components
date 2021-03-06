var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var _ = require('lodash');

/**
 * @module FieldValueMixin
 */
module.exports = {

  /**
   * Look at state then props to determine field's current value.
   * When used during initialization, state will most likely not be set, so defaults to props.value
   * @return {obj} Field Value
   */
  getFieldValue: function(){
    var fieldValue = _.has(this.state,'value') ? this.state.value : this.props.value;
    var isChecked;
    // If a checkbox, with a single value (which will use Checkable instead of FieldGroup),
    // is checked, return field value, otherwise, return null
    if(this.isRadioOrCheckbox() && !this.isFieldGroup()){
      isChecked = _.has(this.state,'checked') ? this.state.checked :
                  _.has(this.props,'checked') ? this.props.checked : false;
      fieldValue = !isChecked ? null : fieldValue ;
    }
    return fieldValue;
  },

  /**
   * Registers listener that will fire event containing the field's current value.
   */
  componentDidMount: function(){
    Dispatcher.register( this.props.id + '-FIELD-VALUE' , function(action,data){
      if( action === constants.actions.GET_FIELD_VALUE &&
          (data.id === this.props.id || data.name === this.props.name )) {
        Flux.doAction(constants.actions.FIELD_VALUE, {
          id : this.props.id,
          name : this.props.name,
          value : this.getFieldValue(),
          persistInSession: this.props.persistInSession
        });
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-FIELD-VALUE');
  }

};
