import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react-addons-test-utils';
import Immutable from 'immutable';
import update from 'react/lib/update';

let multirowFixture = require('../fixtures/grid-multi-row.json');
let twoColFixture = require('../fixtures/grid-two-col.json');
let distFixture = require('../fixtures/grid-distributeComponents.json');
let Field = elements.field;
let Grid = elements.grid;

describe('Grid', () => {

  it('can render a Bootstrap 3 grid, with multiple rows and columns', () => {
    let config = Immutable.fromJS(multirowFixture.config).set('schema', multirowFixture).toJS();
    let renderer = TestUtils.createRenderer();
    renderer.render(
      <Grid {...config}>
        <Field {...config.schema.components.field_1.config}>one</Field>
        <Field {...config.schema.components.field_2.config}>two</Field>
        <Field {...config.schema.components.field_3.config}>three</Field>
        <Field {...config.schema.components.field_4.config}>four</Field>
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
    expect(second.md).toBe('6');
    expect(second.sm).toBe('12');
    expect(second.xs).toBe('12');
    expect(third.md).toBe('4');
    expect(third.sm).toBe(undefined);
    expect(third.xs).toBe(undefined);
    expect(fourth.md).toBe('4');
    expect(fourth.sm).toBe(undefined);
    expect(fourth.xs).toBe(undefined);
  });

  describe('#add', () => {
    it ('adds two params together', () => {
      expect(Grid.add(133, 1)).toEqual(134);
      expect(Grid.add(1, 1)).toEqual(2);
      expect(Grid.add('a', 'b')).toEqual('ab');
    });
  });

  describe('#distributeComponents', () => {
    it ('will distribute components sequentially', () => {
      let config = update(multirowFixture, {config: {id: {$set: 'test'}}});
      let rows = Grid.distributeComponents(config.config.rows, distFixture);
      expect(rows[0][0].children[0].name).toEqual('one');
      expect(rows[0][1].children[0].name).toEqual('two');
      expect(rows[1][0].children[0].name).toEqual('three');
      expect(rows[1][1].children[0].name).toEqual('four');
    });

    it ('can distribute components sequentially even if columns.length < components.length', () => {
      let rows = Grid.distributeComponents(multirowFixture.config.rows, distFixture);
      expect(rows[0][0].children[0].name).toEqual('one');
      expect(rows[0][1].children[0].name).toEqual('two');
      expect(rows[1][0].children[0].name).toEqual('three');
      expect(rows[1][1].children[0].name).toEqual('four');
      expect(rows[2][0].children[0].name).toEqual('five');
    });
  });
});
