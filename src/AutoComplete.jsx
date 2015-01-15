var React = require('react');
var update = require('react/lib/update');
var Typeahead = require('react-typeahead').Typeahead;
var OptionsMixin = require('./OptionsMixin');
var Dispatcher = require('fluxify').dispatcher;
var constants = require('./constants');
var _ = require('lodash');

/**
 * Options are configured as an array of objects, but the Typeahead
 * component expects a list of strings. This function converts an
 * array of Option configs to an array of the Option.label values.
 * @param {array} options - an array of option config objects
 * @returns {array} an array of strings
 */
var getOptionLabels = function(options){
  return _.map(options, function(option){
    return option.label;
  });
};

/**
 * Autocomplete field. Will filter a list of options based on user input.
 * This wraps the react-typeahead#Typeahead component from https://github.com/fmoo/react-typeahead.
 * @module AutoComplete
 */
module.exports = React.createClass({

  displayName: 'AutoComplete',

  propTypes: {
    ref: React.PropTypes.string,
    className: React.PropTypes.string,
    onOptionSelected: React.PropTypes.func,
    customClasses: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      ref: 'typeahead',
      className: "field-autocomplete",
      customClasses: {
        input: 'form-control',
        results: 'list-group',
        listItem: 'list-group-item'
      }
    };
  },

  getInitialState: function(){
    return {
      options: [],
      value: ''
    };
  },

  mixins: [OptionsMixin],

  statics: {
    getOptionLabels: getOptionLabels
  },

  /**
   * When the user chooses an option from the list, this method is called
   * with the selection as param.
   * @param {string} label - the user's selection
   * @fires field:value:change
   */
  onOptionSelected: function(label){
    var opt = _.find(this.state.options, {label: label});
    this.setState({value: opt.value});
    Dispatcher.dispatch({
      'actionType' : constants.actions.FIELD_VALUE_CHANGE,
      'data' : {
        id: this.props.id,
        name: this.props.name,
        value: opt.value
      }
    });
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return !!nextState.options.length;
  },

  /**
   * Renders the auto complete markup. If we have not loaded the options
   * yet then we render a placeholder. When the options are finished loading
   * we will render the actual Typeahead component.
   * @returns {JSX}
   */
  render: function(){
    if ( this.state.options.length ){
      var config = update(this.props, {
        options: { $set: getOptionLabels(this.state.options) }
      });
      return <Typeahead {...config} onOptionSelected={this.onOptionSelected} />;
    } else {
      return <div className="field-autocomplete"></div>;
    }
  }

});
