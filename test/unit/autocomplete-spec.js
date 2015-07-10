import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import AutoComplete from '../../src/AutoComplete';
import constants from '../../src/constants';
import { dispatcher as Dispatcher } from 'fluxify';

let { FIELD_VALUE_CHANGE } = constants.actions;
let fixture = require('../fixtures/autocomplete.json');
let renderer = TestUtils.createRenderer();

describe('AutoComplete', () => {

  it('can render', () => {
    renderer.render(<AutoComplete {...fixture.config}/>);
    let output = renderer.getRenderOutput();
    expect(output.props.className).toEqual('field-autocomplete');
    expect(output.props.id).toEqual(fixture.config.id);
    expect(output.props.name).toEqual(fixture.config.name);
    expect(output.props.label).toEqual(fixture.config.label);
    expect(output.props.type).toEqual(fixture.config.type);
    expect(output.props.options.length).toEqual(fixture.config.options.length);
  });

  it('can handle user selection', (done) => {
    let valueFixture = 'four';
    renderer.render(<AutoComplete {...fixture.config} />);
    let output = renderer.getRenderOutput();
    Dispatcher.register('ac-test', (action, data) => {
      if (action === FIELD_VALUE_CHANGE) {
        Dispatcher.unregister('ac-test');
        expect(data.name).toEqual(fixture.config.name);
        expect(data.id).toEqual(fixture.config.id);
        expect(data.value).toEqual(valueFixture);
        done();
      }
    });

    output.props.onSelect({value: valueFixture})
  });
});
