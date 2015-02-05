var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var Grid = Components.elements.grid;
var update = require('react/lib/update');

describe('Grid', function(){

	it('can render a Bootstrap 3 grid', function(){
		var schema = require('../fixtures/grid-two-col.json');
		var component = Components.factory(schema);
		var grid = TestUtils.renderIntoDocument(component);
		var row = grid.getDOMNode().childNodes[0];
		var cols = row.childNodes;
		expect(grid.getDOMNode().className).toEqual('grid-layout');
		expect(cols.length).toEqual(2);
		expect(cols[0].className).toEqual('col-md-6 col-sm-4');
		expect(cols[1].className).toEqual('col-md-12 col-sm-12 col-xs-12');
		expect(cols[0].childNodes[0].textContent).toEqual('FieldTest one');
		expect(cols[1].childNodes[0].textContent).toEqual('FieldTest two');
	});

	it('can render multiple rows', function(){
		var schema = require('../fixtures/grid-multi-row.json');
		var component = Components.factory(schema);
		var grid = TestUtils.renderIntoDocument(component);
		expect(grid.getDOMNode().childNodes.length).toEqual(2);
	});

	describe('#getTotalColumns', function(){
		it('can return the total number of columns', function(){
			expect(Grid.getTotalColumns([[1,2], [3,4,5], [6,7]])).toEqual(7);
			expect(Grid.getTotalColumns([[1,2,3,4]])).toEqual(4);
		});
	});

	describe('#distributeIndexes', function(){
		it('can evenly distribute component indexes amound columns', function(){
			expect(Grid.distributeIndexes(10, 3, 0)).toEqual([0,3,6,9]);
			expect(Grid.distributeIndexes(7, 4, 1)).toEqual([1, 5]);
		});
	});

	describe('#add', function(){
		it('adds two params together', function(){
			expect(Grid.add(133, 1)).toEqual(134);
			expect(Grid.add(1,1)).toEqual(2);
			expect(Grid.add('a', 'b')).toEqual('ab');
		});
	});

	describe('#getRowIndex', function(){
		it('will return 0 if the current row index is 0', function(){
			expect(Grid.getRowIndex(0)).toEqual(0);
		});
		it('will return n + 1 if n is greater than 0', function(){
			expect(Grid.getRowIndex(1)).toEqual(2);
			expect(Grid.getRowIndex(2)).toEqual(3);
			expect(Grid.getRowIndex(3)).toEqual(4);
			expect(Grid.getRowIndex(4)).toEqual(5);
		});
	});

	describe('#distributeComponents', function(){
		it('will distribute components sequentially', function(){
			var schema = require('../fixtures/grid-multi-row.json');
			var components = require('../fixtures/grid-distributeComponents.json');
			var config = update(schema, {config: {id: {$set: 'test'}}});
			config.config.rows[1].push([{md: '4'}]);
			var indexDistro = Grid.distributeIndexes.bind(null, 5, 5);
			var rows = Grid.distributeComponents(config.config.rows, components, indexDistro);
			expect(rows[0][0].children[0].name).toEqual('one');
			expect(rows[0][1].children[0].name).toEqual('two');
			expect(rows[1][0].children[0].name).toEqual('three');
			expect(rows[1][1].children[0].name).toEqual('four');
			expect(rows[1][2].children[0].name).toEqual('five');
		});
		it('can distribute components sequentially even if columns.length < components.length', function(){
			var schema = require('../fixtures/grid-multi-row.json');
			var components = require('../fixtures/grid-distributeComponents.json');
			var indexDistro = Grid.distributeIndexes.bind(null, 5, 4);
			var rows = Grid.distributeComponents(schema.config.rows, components, indexDistro);
			expect(rows[0][0].children[0].name).toEqual('one');
			expect(rows[0][0].children[1].name).toEqual('five');
			expect(rows[0][1].children[0].name).toEqual('two');
			expect(rows[1][0].children[0].name).toEqual('three');
			expect(rows[1][1].children[0].name).toEqual('four');
		});
	});

});
