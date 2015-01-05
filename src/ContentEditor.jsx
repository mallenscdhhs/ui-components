'use-strict';
var React = require('react/addons');
var FieldMixin = require('./FieldMixin');
var Queue = require('./EventQueue');
var _ = require('lodash');
require('pen');
var inputProps = ['id', 'name', 'value', 'maxLength', 'className', 'aria-describedby'];

module.exports = React.createClass({

  displayName: 'ContentEditor',

  mixins: [FieldMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool
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
    this.setState({'value': value});
    Queue.push({
      'entityEvent': 'field:value:change',
      'data': {
        'id': this.props.id,
        'name': this.props.name,
        'value': value
      }
    });
  },

  getInitialState: function(){
    return {
      'value': this.props.value || '',
      'editor' : null
    };
  },

  render: function(){
    var props = _.pick(this.props, inputProps);
    return <div id={this.props.id} key={this.props.id} ref="editor" value={this.state.value} name={this.props.name} {...props} ></div>;
  }

});