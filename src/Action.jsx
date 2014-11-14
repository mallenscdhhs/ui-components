var React = require('react/addons');

var Action = React.createClass({

  /**
  * Return an <a> (link) template
  * @return {JSX Template}
  */
  getLink: function(){
    return (<a href={this.props.url} key="actionLinkKey" className="btn btn-default active">{this.props.name}</a>);
  },

  /**
  * Return a Button template
  * @return {JSX Template}
  */
  getButton: function(){
    return (<button type="button" key="actionButtonKey" className="btn btn-default">{this.props.name}</button>);
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