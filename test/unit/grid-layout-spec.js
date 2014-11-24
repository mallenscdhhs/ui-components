describe('Grid Layout component', function(){	
	var TestUtils = React.addons.TestUtils;

	it('can render a Bootstrap 3 grid', function(){
		var config = require('../fixtures/grid-two-col.json');
		var Grid = Components.factory(config);
		var grid = TestUtils.renderIntoDocument(Grid);		
		var row = grid.getDOMNode().childNodes[0];
		var cols = row.childNodes;		
		expect(grid.getDOMNode().className).toEqual('grid-layout');
		expect(cols.length).toEqual(2);
		expect(cols[0].className).toEqual('col-md-6 col-sm-4');
		expect(cols[1].className).toEqual('col-md-12 col-sm-12 col-xs-12');
		expect(cols[0].childNodes[0].textContent).toEqual('Test one');
		expect(cols[1].childNodes[0].textContent).toEqual('Test two');
	});

	it('can render multiple rows', function(){
		var config = require('../fixtures/grid-multi-row.json');
		var Grid = Components.factory(config);
		var grid = TestUtils.renderIntoDocument(Grid);		
		expect(grid.getDOMNode().childNodes.length).toEqual(2);
	});
	
	it('can render a range of components in one column', function(){
		var config = require('../fixtures/grid-col-range.json');
		var Grid = Components.factory(config);
		var grid = TestUtils.renderIntoDocument(Grid);		
		var row = grid.getDOMNode().childNodes[0];
		var cols = row.childNodes;		
		expect(cols.length).toEqual(2);
		expect(cols[0].childNodes.length).toEqual(2);
		expect(cols[1].childNodes.length).toEqual(1);
	});
});