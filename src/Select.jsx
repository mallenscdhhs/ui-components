'use-strict';
var React = require('react');
var OptionsMixin = require('./OptionsMixin');
var _ = require('lodash');
var update = require('react/lib/update');
var ValueChangeMixin = require('./ValueChangeMixin');

/**
 * Returns the selected state of an <option>. Used in filter.
 * @param {ReactDOMElement} option
 * @returns {boolean}
 */
function isOptionSelected(option){
  return option.selected;
}

/**
 * Returns the value of the passed-in <option>. Used in map.
 * @param {ReactDOMElement} option
 * @returns {string}
 */
function getOptionValue(option){
  return option.value;
}

/**
 * Renders a <select> and manages its state.
 * @module Select
 */
module.exports = React.createClass({

  displayName: 'Select',

  mixins: [OptionsMixin, ValueChangeMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    multiple: React.PropTypes.bool,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string),
    defaultOption: React.PropTypes.shape({
      value: React.PropTypes.string,
      label: React.PropTypes.string
    }),
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])
  },

  getDefaultProps: function(){
    return {
      inputProps: ['id', 'name', 'multiple', 'className', 'aria-describedby'],
      defaultOption: {
        value: '',
        label: 'select...'
      }
    };
  },

  getInitialState: function(){
    return {
      options: [],
      value: this.props.value || (this.props.multiple? [] : '')
    };
  },

  /**
   * Return default 'option' if not a multiselect, so dropdowns will not have 'default' selected options
   * @return {jsx}
   */
  getEmptyOption: function(){
    var defaultOption;
    if(this.props.multiple !== true){
      defaultOption = <option value={this.props.defaultOption.value} key={"option-default-option"}>{this.props.defaultOption.label}</option>;
    }
    return defaultOption;
  },

  handleSelection: function(event){
    var opts;
    var e = { target: { value: event.target.value }};
    if ( this.props.multiple === true ) {
      opts = _.toArray(event.target.options);
      e.target.value = _.map(_.filter(opts, isOptionSelected), getOptionValue);
    }
    this.onChange(e);
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    return (
      <select value={this.state.value} onChange={this.handleSelection} {...props}>
        {this.getEmptyOption()}
        {_.map(this.state.options, function(opt){
          return <option value={opt.value} key={"option-"+opt.value}>{opt.label}</option>;
        })}
      </select>
    );
  }
});