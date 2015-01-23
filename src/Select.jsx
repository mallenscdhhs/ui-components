'use-strict';
var React = require('react');
var OptionsMixin = require('./OptionsMixin');
var FieldMixin = require('./FieldMixin');
var _ = require('lodash');
var update = require('react/lib/update');

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

  mixins: [FieldMixin, OptionsMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    multiple: React.PropTypes.bool,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func
  },

  getDefaultProps: function(){
    return {
      componentType: 'field',
      inputProps: ['id', 'name', 'value', 'multiple', 'className', 'aria-describedby']
    };
  },

  getInitialState: function(){
    return {
      options: [],
      value: this.props.value || (this.props.multiple? [] : '')
    };
  },

  handleSelection: function(event){
    var opts;
    var e = { target: { value: event.target.value }};
    if ( this.props.multiple === true ) {
      opts = _.toArray(event.target.options);
      e.target.value = _.map(_.filter(opts, isOptionSelected), getOptionValue);
    }
    this.handleInputChange(e);
  },

  shouldComponentUpdate: function(nextProps, nextState){
    var hasNewValue = nextState.value !== this.state.value;
    var hasNewOptions = nextState.options.length !== this.state.options.length;
    return  hasNewValue || hasNewOptions;
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    return (
      <select value={this.state.value} onChange={this.handleSelection} {...props}>
        {_.map(this.state.options, function(opt){
          return <option value={opt.value} key={"option-"+opt.value}>{opt.label}</option>;
        })}
      </select>
    );
  }
});
