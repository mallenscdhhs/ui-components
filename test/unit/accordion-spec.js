import React from 'react';
import Accordion from '../../src/Accordion';
import AccordionPanel from '../../src/AccordionPanel';
import TestUtils from 'react-addons-test-utils';
import fixture from '../fixtures/accordion.json';
import _ from 'lodash';

describe('Accordion', () => {
  let accordion = TestUtils.renderIntoDocument(<Accordion {...fixture.components.accordion.config}/>);
  let dom = React.findDOMNode(accordion);

  it('renders a bootstrap accordion', () => {
    expect(dom.id).toEqual('accordion');
    expect(dom.className).toEqual('accordion panel-group');
  });

  it('can be configured for any panel to be expanded by default', () => {
    expect(accordion.props.defaultActiveKey).toEqual(0);
    let updatedFixture = _.set(fixture, 'components.accordion.config.defaultActiveKey', 1);
    let updatedAccordion = TestUtils.renderIntoDocument(<Accordion {...updatedFixture.components.accordion.config}/>);
    expect(updatedAccordion.props.defaultActiveKey).toEqual(1);
  });

  it('can persist the expanded panel eventKey as the accordion\'s defaultActiveKey', () => {
    let accordionPanel = TestUtils.renderIntoDocument(<AccordionPanel {...fixture.components.panel1.config}/>);
    // simulate clicking on a panel anchor
    let e = {nativeEvent: {type: 'click'}};
    accordionPanel.handleClick(e);
    expect(e.component).toBeDefined();
    expect(e.component.eventKey).toEqual(0);
    // AccordionPanel event before bubbled
    let apEvent = e.component;
    accordion.handleClick(e);
    expect(e.component).toBeDefined();
    expect(e.component.schemaUpdates.defaultActiveKey).toEqual(apEvent.eventKey);
  });

});
