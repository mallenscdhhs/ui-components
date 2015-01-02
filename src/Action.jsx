'use-strict';
var React = require('react/addons');
var _ = require('lodash');
var Queue = require('./EventQueue');
var EditorToggle = require('./EditorToggle');

module.exports = React.createClass({
  displayName: 'Action',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    event: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    url: React.PropTypes.string,
    classNames: React.PropTypes.arrayOf(React.PropTypes.string)    
  },

  getDefaultProps: function(){
    return {
      componentType: 'action'
    };
  },

  /**
  * Return a string of classes
  * @return {String}
  */
  getClasses: function(){
    var classes = ['btn', 'editable-component'];
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
    return (
      <a 
        href={this.props.url} 
        id={this.props.id} 
        key={this.props.id+"-action"} 
        className={this.getClasses()} 
        onClick={this.handleClick}>
        <EditorToggle {...this.props}/>
        {this.props.name}
      </a>
    );
  },

  /**
  * Return a <button> template
  * @return {JSX Template}
  */
  getButton: function(){
    return (
      <button 
        type="button" 
        id={this.props.id} 
        key={this.props.id+"-action"} 
        className={this.getClasses()} 
        onClick={this.handleClick}>
        <EditorToggle {...this.props}/>
        {this.props.name}
      </button>
    );
  },

  /**
   * Render a Action component.
   * @returns {JSX}
   */
  render: function(){ 
    return (this.props.type === 'button')? this.getButton() : this.getLink();
  }

});