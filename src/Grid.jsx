var React = require('react/addons');

var Grid = React.createClass({
	render: function(){
		return(
			<div className="grid">
				{this.props.rows.map(function(row, r){
					
				})}
			</div>
		);
	}
});

module.exports = Grid;