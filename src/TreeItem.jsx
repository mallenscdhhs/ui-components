var React = require('react/addons');

module.exports = React.createClass({

	displayName: 'TreeItem',	

	getInitialState: function(){
		return {
			active: !!this.props.active,
			disabled: !!this.props.disabled
		};
	},

	render: function(){
		var liClassNames = React.addons.classSet({
			active: this.state.active,
			disabled: this.state.disabled
		});
		return (
      <li className={liClassNames} role="presentation">
        <a href={"#"+this.props.pageId} data-disabled={this.state.disabled}>{this.props.title}</a>
        {this.props.children}
      </li>
		);
	}
});