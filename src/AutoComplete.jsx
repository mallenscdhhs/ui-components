'use-strict';

var React = require('react');
var update = require('react/lib/update');
var Combobox = require('react-widgets').Combobox;
var OptionsMixin = require('./OptionsMixin');
var Flux = require('fluxify');
var constants = require('./constants');
var _ = require('lodash');


/**
 * Autocomplete field. Will filter a list of options based on user input.
 * This wraps the react-widgets#Combobox component from http://jquense.github.io/react-widgets/docs/#/combobox.
 * @module AutoComplete
 */
module.exports = React.createClass({

  displayName: 'AutoComplete',

  propTypes: {
    id: React.PropTypes.string,
    ref: React.PropTypes.string,
    suggest: React.PropTypes.bool,
    filter: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.func,
      React.PropTypes.oneOf(['contains', 'startsWith', 'endsWith']),
    ]),
    className: React.PropTypes.string,
    onOptionSelected: React.PropTypes.func,
    customClasses: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    valueField: React.PropTypes.string,
    textField: React.PropTypes.string,
    value: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      ref: 'combobox',
      className: "field-autocomplete",
      suggest: true,
      filter: 'contains',
      valueField: 'value',
      textField: 'label'
    };
  },

  getInitialState: function(){
    return {
      options: [],
      value: ''
    };
  },

  mixins: [OptionsMixin],

  /**
   * When the user chooses an option from the list, this method is called
   * with the selection as param.
   * @param {string} label - the user's selection
   * @fires field:value:change
   */
  onOptionSelected: function(opt){
    this.setState({value: opt.value});
    Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, {
      id: this.props.id,
      name: this.props.name,
      value: opt.value
    });
  },

  /**
   * Renders the auto complete markup. If we have not loaded the options
   * yet then we render a placeholder. When the options are finished loading
   * we will render the actual Typeahead component.
   * @returns {JSX}
   */
  render: function(){
    var isBusy = this.state.options.length? false : true;
    var props = _.omit(this.props, ['value']);
    return (
      <Combobox {...props}
        onSelect={this.onOptionSelected}
        defaultValue={this.props.value}
        busy={isBusy}
        data={this.state.options}/>
    );
  }

});
