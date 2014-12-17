'use-strict';
var React = require('react/addons');
var _ = require('lodash');
var Queue = require('./EventQueue');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Action',

  mixins: [EditorMixin],

  /**
  * Return a string of classes
  * @return {String}
  */
  getClasses: function(){
    var classes = ['btn','editable-component'];
    // Add default link-type for action links
    if(this.props.type==='link'){
      classes.push('btn-link');
    }
    // Add all passed in classes
    if(this.props.classNames){
      classes = classes.concat(this.props.classNames);      
    }
    return classes.join(' ');
  },

  /**
   * Event handler for onClick, that pushes a message to the queue, with the action is clicked.
   * It's used with workflow to update page based on the action clicked.
   * @returns {void}
   */
  handleClick: function(){
    // TODO: update 'next' with actual 'verbs' for the actions
    Queue.push({
      entityEvent: this.props.event,
      data: this.props
    });
  },

  /**
  * Return an <a> (link) template
  * @return {JSX Template}
  */
  getLink: function(){
    return (<a href={this.props.url} id={this.props.id} key="actionLinkKey" className={this.getClasses()} onClick={this.handleClick}>{this.getEditController("Action")}{this.props.name}</a>);
  },

  /**
  * Return a Button template
  * @return {JSX Template}
  */
  getButton: function(){
    return (<button type="button" id={this.props.id} key="actionButtonKey" className={this.getClasses()} onClick={this.handleClick}>{this.getEditController("Action")}{this.props.name}</button>);
  },

  /**
  * Determine what action template to return
  * @returns {JSX Template}
  */
  getAction: function(){
    if(this.props.type === 'button'){
      return this.getButton();
    }else{
      return this.getLink();
    }
  },

  /**
   * Render a Action component.
   * @returns {JSX}
   */
  render: function(){ 
    return ( this.getAction() );
  }

});