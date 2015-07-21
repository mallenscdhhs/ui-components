import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import update from 'react/lib/update';

let multirowFixture = require('../fixtures/grid-multi-row.json');
let twoColFixture = require('../fixtures/grid-two-col.json');
let distFixture = require('../fixtures/grid-distributeComponents.json');

describe('Grid', function(){

	let Grid = elements.grid;

	it('can render a Bootstrap 3 grid', function(){
		let component = Factory.build(elements, twoColFixture, twoColFixture)[0];
		let grid = TestUtils.renderIntoDocument(component);
		let row = grid.getDOMNode().childNodes[0];
		let cols = row.childNodes;
		expect(grid.getDOMNode().className).toEqual('grid-layout');
		expect(cols.length).toEqual(2);
		expect(cols[0].className).toEqual('col-md-6 col-sm-4');
		expect(cols[1].className).toEqual('col-md-12 col-sm-12 col-xs-12');
		expect(cols[0].childNodes[0].textContent).toEqual('Test one');
		expect(cols[1].childNodes[0].textContent).toEqual('Test two');
	});

	it('can render multiple rows', function(){
		let component = Factory.build(elements, multirowFixture, multirowFixture)[0];
		let grid = TestUtils.renderIntoDocument(component);
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
			let config = update(multirowFixture, {config: {id: {$set: 'test'}}});
			let rows = Grid.distributeComponents(config.config.rows, distFixture);
			expect(rows[0][0].children[0].name).toEqual('one');
			expect(rows[0][1].children[0].name).toEqual('two');
			expect(rows[1][0].children[0].name).toEqual('three');
			expect(rows[1][1].children[0].name).toEqual('four');
		});
		it('can distribute components sequentially even if columns.length < components.length', function(){
			let rows = Grid.distributeComponents(multirowFixture.config.rows, distFixture);
			expect(rows[0][0].children[0].name).toEqual('one');
			expect(rows[0][1].children[0].name).toEqual('two');
			expect(rows[1][0].children[0].name).toEqual('three');
			expect(rows[1][1].children[0].name).toEqual('four');
			expect(rows[2][0].children[0].name).toEqual('five');
		});
	});

});
