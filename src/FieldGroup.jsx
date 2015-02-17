var React = require('react');
var update = require('react/lib/update');
var Checkable = require('./Checkable');
var FieldMixin = require('./FieldMixin');
var EditorToggle = require('./EditorToggle');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var OptionsMixin = require('./OptionsMixin');
var DependencyMixin = require('./DependencyMixin');
var ValidationMixin = require('./ValidationMixin');
var _ = require('lodash');

/**
 * Determines if the passed-in value matches the value of
 * the FieldGroup(can be an Array or String).
 * @param {object} props
 * @param {string} value
 * @returns {boolean}
 */
var isOptionChecked = function(props, value){
  if ( _.isArray(props.value) ) {
    return _.contains(props.value, value);
  } else {
    return value === props.value;
  }
};

module.exports = React.createClass({

  displayName: 'FieldGroup',

  mixins: [FieldMixin, ValidationMixin, OptionsMixin, DependencyMixin],

  statics: {
    isOptionChecked: isOptionChecked
  },

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    required: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      componentType: 'field'
    };
  },

  getInitialState: function(){
    return {
      'value' : this.props.value || (this.props.type === 'checkbox'? [] : ''),
      'display': (!this.hasDependency() || this.props.dependency.initialState !=='hidden'),
      'has-error' : false
    };
  },

  componentDidMount: function(){
    Dispatcher.register( this.props.id + '-FIELD-GROUP-CHANGE' , function(action,data){
      if( action === constants.actions.FIELD_GROUP_VALUE_CHANGE &&
          data.name === this.props.name &&
          data.id.lastIndexOf(this.props.id) >= 0) {
        var value = data.value;
        if ( this.props.type === 'checkbox' ) {
          if ( data.value === null ) {
            value = _.filter(this.state.value, {'name': data.name});
          } else {
            value = this.state.value.concat([data.value]);
          }
        }
        this.setState({'value': value});
        var eventData = {
          id: this.props.id,
          name: this.props.name,
          value: value,
          rules : this.props.rules
        };
        Flux.doAction( constants.actions.FIELD_VALUE_CHANGE , eventData );
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-FIELD-GROUP-CHANGE' );
  },

  render: function(){
    var checkOptionValue = isOptionChecked.bind(null, this.state);
    return (
      <fieldset className={this.getFieldClassNames()}>
        <EditorToggle {...this.props}/>
        <legend className="fieldGroup-checkable">{this.props.label}{this.getRequiredIndicator()}</legend>
        {_.map(this.state.options, function(option){
          var id = this.props.id + '-option-' + option.value;
          var config = update(option, {
            id: {$set: id},
            name: {$set: this.props.name},
            type: {$set: this.props.type},
            checked: {$set: checkOptionValue(option.value)},
            isFieldGroup: {$set: true},
            key: {$set: id}
          });
          return <Checkable {...config}/>;
        }, this)}
        {this.getHelpBlock()}
      </fieldset>
    );
  }

});
