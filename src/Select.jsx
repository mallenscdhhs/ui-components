'use-strict';
var React = require('react');
var OptionsMixin = require('./OptionsMixin');
var FieldMixin = require('./FieldMixin');
var _ = require('lodash');
var inputProps = ['id', 'name', 'value', 'multiple', 'className', 'aria-describedby'];

module.exports = React.createClass({

  displayName: 'Select',

  mixins: [FieldMixin, OptionsMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    multiple: React.PropTypes.bool,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func
  },

  getDefaultProps: function(){
    return {
      componentType: 'field'
    };
  },

  getInitialState: function(){
    return {
      options: [],
      value: this.props.value || (this.props.multiple? [] : '')
    };
  },

  handleSelection: function(event){
    var value = event.target.value;
    if ( this.props.multiple && !_.contains(this.state.value, value )) {
      event.target.value = this.state.value.concat([value]);
    }
    this.handleInputChange(event);
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return (
      <select value={this.state.value} onChange={this.handleSelection} {...props}>
        {_.map(this.state.options, function(opt){
          return <option value={opt.value} key={"option-"+opt.value}>{opt.label}</option>;
        })}
      </select>
    );
  }
});
