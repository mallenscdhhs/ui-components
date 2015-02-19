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
		expect(cols[0].childNodes[0].textContent).toEqual('Test oneField');
		expect(cols[1].childNodes[0].textContent).toEqual('Test twoField');
	});

	it('can render multiple rows', function(){
		var schema = require('../fixtures/grid-multi-row.json');
		var component = Components.factory(schema);
		var grid = TestUtils.renderIntoDocument(component);
		expect(grid.getDOMNode().childNodes.length).toEqual(3);
	});

	describe('#add', function(){
		it('adds two params together', function(){
			expect(Grid.add(133, 1)).toEqual(134);
			expect(Grid.add(1,1)).toEqual(2);
			expect(Grid.add('a', 'b')).toEqual('ab');
		});
	});

	describe('#distributeComponents', function(){
		it('will distribute components sequentially', function(){
			var schema = require('../fixtures/grid-multi-row.json');
			var components = require('../fixtures/grid-distributeComponents.json');
			var config = update(schema, {config: {id: {$set: 'test'}}});
			var rows = Grid.distributeComponents(config.config.rows, components);
			expect(rows[0][0].children[0].name).toEqual('one');
			expect(rows[0][1].children[0].name).toEqual('two');
			expect(rows[1][0].children[0].name).toEqual('three');
			expect(rows[1][1].children[0].name).toEqual('four');
		});
		it('can distribute components sequentially even if columns.length < components.length', function(){
			var schema = require('../fixtures/grid-multi-row.json');
			var components = require('../fixtures/grid-distributeComponents.json');
			var rows = Grid.distributeComponents(schema.config.rows, components);
			expect(rows[0][0].children[0].name).toEqual('one');
			expect(rows[0][1].children[0].name).toEqual('two');
			expect(rows[1][0].children[0].name).toEqual('three');
			expect(rows[1][1].children[0].name).toEqual('four');
			expect(rows[2][0].children[0].name).toEqual('five');
		});
	});

});
