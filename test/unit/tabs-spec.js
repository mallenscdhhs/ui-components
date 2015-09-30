import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Factory from '../../src/Factory';
import ControlledTabs from '../../src/Tabs';
import ControlledTab from '../../src/Tab';
import elements from '../../src/index';
import Immutable from 'immutable';
let fixture = require('../fixtures/tabs.json');

describe('ControlledTabs', function(){

  it('Renders a ControlledTabs container and ControlledTab', () => {
    let renderer = TestUtils.createRenderer();
    let controlledTabs = fixture.components.addressTabs;
    let controlledTabOne = fixture.components.primaryAddressTab;
    let controlledTabTwo = fixture.components.billingAddressTab;
    renderer.render(
      <ControlledTabs {...controlledTabs.config} schema={fixture}>
        <ControlledTab {...controlledTabOne.config} />
        <ControlledTab {...controlledTabTwo.config} />
      </ControlledTabs>
    );
    let output = renderer.getRenderOutput();
    expect(output.key).toBe('controlledTabbedArea');
    expect(output.props.activeKey).toBe(controlledTabs.config.activeKey);
    let firstTab = output.props.children['.0'];
    expect(firstTab.props.id).toBe(controlledTabOne.config.id);
    expect(firstTab.props.eventKey).toBe(controlledTabOne.config.eventKey);
    expect(firstTab.props.disabled).toBe(controlledTabOne.config.disabled);
    let secondTab = output.props.children['.1'];
    expect(secondTab.props.id).toBe(controlledTabTwo.config.id);
    expect(secondTab.props.eventKey).toBe(controlledTabTwo.config.eventKey);
    expect(secondTab.props.disabled).toBe(controlledTabTwo.config.disabled);
  });

});
