var React = require('react/addons');
var Typeahead = require('react-typeahead').Typeahead;
var OptionsMixin = require('./OptionsMixin');
var _ = require('lodash');

var getOptionLabels = function(options){
  return _.map(options, function(option){
    return option.label;
  });
};

module.exports = React.createClass({

  displayName: 'AutoComplete',

  propTypes: {
    value: React.PropTypes.string
  },

  getInitialState: function(){
    return {
      options: [],
      value: ''
    };
  },

  mixins: [OptionsMixin],

  /**
   *
   */
  onOptionSelected: function(label){
    var opt = _.find(this.state.options, {label: label});
    this.setState({value: opt.value});
  },

  render: function(){
    if ( this.state.options.length ){
      return (
        <Typeahead
          ref="typeahead"
          options={getOptionLabels(this.state.options)} 
          className="field-autocomplete"
          onOptionSelected={this.onOptionSelected}
          customClasses={{
            input: 'form-control',
            results: 'list-group',
            listItem: 'list-group-item'
          }} />
      );
    } else {
      return <div className="field-autocomplete"></div>;
    }
  }

});