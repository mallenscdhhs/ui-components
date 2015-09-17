import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import Immutable from 'immutable';
import update from 'react/lib/update';

let multirowFixture = require('../fixtures/grid-multi-row.json');
let twoColFixture = require('../fixtures/grid-two-col.json');
let distFixture = require('../fixtures/grid-distributeComponents.json');

describe('Grid', function(){

  let Grid = elements.grid;

  it('can render a Bootstrap 3 grid, with multiple rows and columns', function(){
    let config = Immutable.fromJS(multirowFixture.config).toJS();
    let renderer = TestUtils.createRenderer();
    renderer.render(
      <Grid {...config}>
        <div>one</div>
        <div>two</div>
				<div>three</div>
        <div>four</div>
      </Grid>
    );
    let output = renderer.getRenderOutput();
    let rowOne = output.props.children[0];
    let rowTwo = output.props.children[1];
    let first = rowOne.props.children[0].props;
    let second = rowOne.props.children[1].props;
    let third = rowTwo.props.children[0].props;
    let fourth = rowTwo.props.children[1].props;
    expect(first.md).toBe('6');
    expect(first.sm).toBe('4');
    expect(first.xs).toBe(undefined);
    expect(first.children[0].props.children).toBe('one');
    expect(second.md).toBe('6');
    expect(second.sm).toBe('12');
    expect(second.xs).toBe('12');
    expect(second.children[0].props.children).toBe('two');
    expect(third.md).toBe('4');
    expect(third.sm).toBe(undefined);
    expect(third.xs).toBe(undefined);
    expect(third.children[0].props.children).toBe('three');
    expect(fourth.md).toBe('4');
    expect(fourth.sm).toBe(undefined);
    expect(fourth.xs).toBe(undefined);
    expect(fourth.children[0].props.children).toBe('four');
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
