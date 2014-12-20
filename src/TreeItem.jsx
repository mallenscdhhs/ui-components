'use-strict';
var React = require('react/addons');
var Queue = require('./EventQueue');

module.exports = React.createClass({

	displayName: 'TreeItem',

	propTypes: {
		id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		active: React.PropTypes.bool,
		disabled: React.PropTypes.bool
	},

	getDefaultProps: function(){
		return {
			active: false,
			disabled: false
		};
	},

	handleClick: function(e){
		if(!this.props.disabled){
			Queue.push({ entityEvent:'tree:load:page', data: this.props.id }); 
		}
	},

	render: function(){
		var liClassNames = React.addons.classSet({
			active: this.props.active,
			disabled: this.props.disabled
		});
		return (
			<li className={liClassNames} role="presentation">
				<a href="javascript:void(0)" data-disabled={this.props.disabled} onClick={this.handleClick}>{this.props.title}</a>
				{this.props.children}
			</li>
		);
	}
});