var React = require('react/addons');
var Queue = require('./EventQueue');

module.exports = React.createClass({

	displayName: 'TreeItem',	

	handleClick: function(){
		if(!this.props.disabled){
			Queue.push({'entityEvent':'tree:load:page','data':{'pageId':this.props.pageId}}); 
		}
	},

	render: function(){
		var liClassNames = React.addons.classSet({
			active: this.props.active,
			disabled: this.props.disabled
		});
		return (
		      <li className={liClassNames} role="presentation">
		        <a href={"#"+this.props.pageId} data-disabled={this.props.disabled}  onClick={this.handleClick}>{this.props.title}</a>
		        {this.props.children}
		      </li>
		);
	}
});