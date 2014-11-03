var React = require('react/addons');

var getComponentName = function(name){
	return [name.slice(0,1).toUpperCase(), name.slice(1)].join('');
};

var Layout = React.createClass({
	render: function(){
		React.render(getComponentName(this.props.type), this.props.config);
	}
});

module.exports = Layout;