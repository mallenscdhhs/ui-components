'use-strict';
var React = require('react');
var FieldMixin = require('./FieldMixin');
var _ = require('lodash');
var inputProps = ['id', 'name', 'value', 'cols', 'rows', 'maxLength', 'className', 'aria-describedby'];

module.exports = React.createClass({

  displayName: 'Textarea',

  mixins: [FieldMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    rows: React.PropTypes.string,
    cols: React.PropTypes.string,
    disabled: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      value: this.props.value || ''
    };
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return <textarea onChange={this.handleInputChange} value={this.state.value} {...props} />;
  }

});
