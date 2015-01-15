'use-strict';
var React = require('react');
var OptionsMixin = require('./OptionsMixin');
var FieldMixin = require('./FieldMixin');
var ValidationMixin = require('./ValidationMixin');
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

  render: function(){
    var props = _.pick(this.props, inputProps);
    return (
      <select value={this.state.value} onChange={this.handleInputChange} {...props}>
        {_.map(this.state.options, function(opt){
          return <option value={opt.value} key={"option-"+opt.value}>{opt.label}</option>;
        })}
      </select>
    );
  }
});
