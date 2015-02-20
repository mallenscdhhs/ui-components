'use-strict';
var React = require('react');
var _ = require('lodash');
var ValueChangeMixin = require('./ValueChangeMixin');
var FieldValueMixin = require('./FieldValueMixin');
require('pen');

/**
 * Renders an editable content input, and uses the "pen" module for WYSIWIG.
 * @module ContentEditor
 */
module.exports = React.createClass({

  displayName: 'ContentEditor',

  mixins: [ValueChangeMixin, FieldValueMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    ref: React.PropTypes.string,
    inputProps: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  componentDidMount: function(){
    var editor = new Pen({
      'editor': this.refs.editor.getDOMNode(),
      'class': 'pen',
      'debug': false,
      'list': [
        'bold', 'italic', 'underline',
        'h2', 'h3', 'p',
        'insertorderedlist', 'insertunorderedlist', 'createlink'
      ]
    });
    editor.on('change',this.handleContentEditorChange);
    editor.on('keyup',this.handleContentEditorKeyup);
    editor.setContent(this.props.value);
    this.setState({'editor':editor});
  },

  componentWillUnmount: function(){
    this.state.editor.destroy();
  },

  /**
   * Used to grab keyUp event, and pass to Change event
   * @param e {event}
   * @return {void}
   */
  handleContentEditorKeyup: function(e) {
    this.handleContentEditorChange(e.target.innerHTML);
  },
  /**
   * Callback for Pen editor change event.
   * Used to send value up the chain of command, over the queue.
   * @param value {string}
   * @return {void}
   */
  handleContentEditorChange: function(value){
    this.onChange({target: {value: value}});
  },

  getInitialState: function(){
    return {
      'value': this.props.value || '',
      'editor' : null
    };
  },

  getDefaultProps: function(){
    return {
      ref: 'editor',
      inputProps: ['ref', 'id', 'name', 'value', 'maxLength', 'className', 'aria-describedby']
    };
  },

  render: function(){
    var props = _.pick(this.props, this.props.inputProps);
    return <div key={this.props.id} value={this.state.value} {...props} ></div>;
  }

});
