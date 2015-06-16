'use-strict';
var React = require('react');
var update = require('react/lib/update');
var Checkable = require('./Checkable');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var OptionsMixin = require('./OptionsMixin');
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

  mixins: [OptionsMixin],

  statics: {
    isOptionChecked: isOptionChecked
  },

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    required: React.PropTypes.bool,
    persistInSession: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      fieldValueChangeAction: constants.actions.FIELD_VALUE_CHANGE
    };
  },

  getInitialState: function(){
    return {
      'value' : this.props.value || (this.props.type === 'checkbox'? [] : '')
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
        // added individualValue to represent the latest individual value changed in a field-group
        Flux.doAction( this.props.fieldValueChangeAction, _.merge(this.props, {individualValue: data.value, value: value}) );
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister( this.props.id + '-FIELD-GROUP-CHANGE' );
  },

  render: function(){
    var checkOptionValue = isOptionChecked.bind(null, this.state);
    return (
      <div className="field-group">
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
      </div>
    );
  }

});
