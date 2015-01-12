var React = require('react');
var update = require('react/lib/update');
var Checkable = require('./Checkable');
var FieldMixin = require('./FieldMixin');
var EditorToggle = require('./EditorToggle');
var Queue = require('./EventQueue');
var OptionsMixin = require('./OptionsMixin');
var DependencyMixin = require('./DependencyMixin');
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

  mixins: [FieldMixin, OptionsMixin, DependencyMixin],

  statics: {
    isOptionChecked: isOptionChecked
  },

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    options: React.PropTypes.shape({
      items: React.PropTypes.arrayOf(React.PropTypes.shape({
        value: React.PropTypes.any,
        label: React.PropTypes.string
      }))
    }),
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
    Queue.subscribe('fieldGroup:item:change:'+this.props.id, this.props.id, function(data){
      var value = data.value;
      if ( this.props.type === 'checkbox' ) {
        if ( data.value === null ) {
          value = _.filter(this.state.value, {name: data.name});
        } else {
          value = this.state.value.concat([data.value]);
        }
      }
      this.setState({value: value});
      Queue.push({
        entityEvent: 'field:value:change:'+this.props.id,
        data: {
          id: this.props.id,
          name: this.props.name,
          value: value
        }
      });
    }.bind(this));
  },

  componentWillUnmount: function(){
    Queue.unSubscribe('fieldGroup:item:change:'+this.props.id, this.props.id);
  },

  render: function(){
    var checkOptionValue = isOptionChecked.bind(null, this.state);
    return (
      <fieldset className={this.getFieldClassNames()}>
        <EditorToggle {...this.props}/>
        <legend>{this.props.label}{this.getRequiredIndicator()}</legend>
        {_.map(this.state.options, function(option){
          var id = this.props.name + '-option-' + option.value;
          var config = update(option, {
            id: {$set: id},
            name: {$set: this.props.name},
            parent: {$set: this.props.id},
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
