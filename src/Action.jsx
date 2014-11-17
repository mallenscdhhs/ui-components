var React = require('react/addons');
var _ = require('underscore');

var Action = React.createClass({
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
  * Return an <a> (link) template
  * @return {JSX Template}
  */
  getLink: function(){
    return (<a href={this.props.url} key="actionLinkKey" className={this.getClasses()}>{this.props.name}</a>);
  },

  /**
  * Return a Button template
  * @return {JSX Template}
  */
  getButton: function(){
    return (<button type="button" id={this.props.id} key="actionButtonKey" className={this.getClasses()}>{this.props.name}</button>);
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

module.exports = Action;