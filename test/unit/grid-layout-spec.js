var React = require('react/addons');
var Grid = React.createFactory(require('../../dist/cjs/Grid'));
var TestUtils = React.addons.TestUtils;

var components = [
	<p>one</p>,
	<p>two</p>,
	<p>three</p>
];

describe('Grid Layout component', function(){
	it('can render a Bootstrap 3 grid', function(){
		var config = { 
			rows: [[{md: '6', sm: '4'}, {md: '12', sm: '12', xs: '12'}]],
			components: components
		};
		var grid = TestUtils.renderIntoDocument(Grid(config));		
		var row = grid.getDOMNode().childNodes[0];
		var cols = row.childNodes;
		console.log(grid.getDOMNode().outerHTML);
		expect(grid.getDOMNode().className).toEqual('grid-layout');
		expect(cols.length).toEqual(2);
		expect(cols[0].className).toEqual('col-md-6 col-sm-4');
		expect(cols[1].className).toEqual('col-md-12 col-sm-12 col-xs-12');
		expect(cols[0].childNodes[0].textContent).toEqual('one');
		expect(cols[1].childNodes[0].textContent).toEqual('two');
	});

	it('can render multiple rows', function(){
		var config = { 
			components: components,
			rows: [
				[{md: '6', sm: '4'}, {md: '12', sm: '12', xs: '12'}],
				[{md: '4'}, {md: '4'}]
			]
		};
		var grid = TestUtils.renderIntoDocument(Grid(config));		
		expect(grid.getDOMNode().childNodes.length).toEqual(2);
	});
	
	it('can render a range of components in one column', function(){
		var config = { 
			rows: [[{md: '4', indexRange: [0,2] }, { md: '8' }]],
			components: components
		};
		var grid = TestUtils.renderIntoDocument(Grid(config));		
		var row = grid.getDOMNode().childNodes[0];
		var cols = row.childNodes;
		console.log(grid.getDOMNode().outerHTML);
		expect(cols.length).toEqual(2);
		expect(cols[0].childNodes.length).toEqual(2);
		expect(cols[1].childNodes.length).toEqual(1);
	});
});