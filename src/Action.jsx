var React = require('react/addons');
var _ = require('underscore');
var Q = require('./EventQueue');

module.exports = React.createClass({

  /**
  * Return a string of classes
  * @return {String}
  */
  getClasses: function(){
    var classes = ['btn'];
    // Add default link-type for action links
    if(this.props.type==='link'){
      classes.push('btn-link');
    }
    // Add all passed in classes
    if(this.props.classes){
      _.each(this.props.classes,function(cla,i){
        classes.push('btn-'+cla);
      });
    }
    return classes.join(' ');
  },

  /**
   * Event handler for onClick, that pushes a message to the queue, with the action is clicked.
   * It's used with workflow to update page based on the action clicked.
   * @returns {void}
   */
  handleClick: function(){
    console.log('CLICK:'+this.props.name);
    // TODO: update 'next' with actual 'verbs' for the actions
    Q.push({'entityEvent':'action:next','data':{'page':1}});
  },

  /**
  * Return an <a> (link) template
  * @return {JSX Template}
  */
  getLink: function(){
    return (<a href={this.props.url} key="actionLinkKey" className={this.getClasses()} onClick={this.handleClick}>{this.props.name}</a>);
  },

  /**
  * Return a Button template
  * @return {JSX Template}
  */
  getButton: function(){
    return (<button type="button" id={this.props.id} key="actionButtonKey" className={this.getClasses()} onClick={this.handleClick}>{this.props.name}</button>);
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