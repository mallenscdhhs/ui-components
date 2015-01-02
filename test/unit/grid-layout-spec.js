var React = require('react/addons');
var Components = require('../../src/main');
var TestUtils = React.addons.TestUtils;

describe('Grid', function(){	

	it('can render a Bootstrap 3 grid', function(){
		var schema = require('../fixtures/grid-two-col.json');		
		var Grid = Components.factory(schema);
		var grid = TestUtils.renderIntoDocument(Grid);		
		var row = grid.getDOMNode().childNodes[0];
		var cols = row.childNodes;		
		expect(grid.getDOMNode().className).toEqual('grid-layout');
		expect(cols.length).toEqual(2);
		expect(cols[0].className).toEqual('col-md-6 col-sm-4');
		expect(cols[1].className).toEqual('col-md-12 col-sm-12 col-xs-12');
		expect(cols[0].childNodes[0].textContent).toEqual('fieldTest one');
		expect(cols[1].childNodes[0].textContent).toEqual('fieldTest two');
	});

	it('can render multiple rows', function(){
		var schema = require('../fixtures/grid-multi-row.json');		
		var Grid = Components.factory(schema);
		var grid = TestUtils.renderIntoDocument(Grid);	
		expect(grid.getDOMNode().childNodes.length).toEqual(2);
	});

	describe('#getNumColumns', function(){
		it('can return the total number of columns', function(){
			var Grid = Components.elements.grid;			
			expect(Grid.getNumColumns([[1,2], [3,4,5], [6,7]])).toEqual(7);
			expect(Grid.getNumColumns([[1,2,3,4]])).toEqual(4);
		});
	});

	describe('#getComponentIndexes', function(){
		it('can evenly distribute component indexes amound columns', function(){
			var Grid = Components.elements.grid;			
			expect(Grid.getComponentIndexes(10, 0, 3)).toEqual([0,3,6,9]);
			expect(Grid.getComponentIndexes(7, 1, 4)).toEqual([1, 5]);
		});
	});
});