var React = require('react/addons');

/**
 * Creates a list of <li> components and optionally renders
 * any nested components recursively.
 * @param {object} config
 * @returns {array}
 */
var renderItems = function(config){
	return config.items.map(function(item, n){
		var classes = React.addons.classSet({ active: this.state.selectedItem === item.pageId });
		return (
			<li className={classes} role="presentation" ref={item.pageId} key={item.pageId} onClick={this.handleClick}>
				<a href={"#"+item.pageId}>{item.title}</a>
				{renderTree.call(this, item)}
			</li>
		);
	}, this);
};

/**
 * Creates a nested list structure recursively.
 * @param {object} config
 * @returns {React.DOM.ul}
 */
var renderTree = function(config){	
	return (config && config.items? 
		<ul className="nav nav-tree">
			{renderItems.call(this, config)}
		</ul> : null);
};

/**
 * A tree navigation component.
 * @module Tree
 */
var Tree = React.createClass({
	propTypes: {
		items: React.PropTypes.arrayOf(React.PropTypes.object)
	},
	getInitialState: function(){
	  var first = this.props.items[0];
		return {
			selectedItem: first.pageId
		};
	},
	handleClick: function(e){
		this.setState({selectedItem: e.target.hash.slice(1)});
	},
	selectItem: function(pageId){
		this.refs[pageId].getDOMNode().click();
	},
	render: function(){
		return renderTree.call(this, this.props);
	}
});

module.exports = Tree;
