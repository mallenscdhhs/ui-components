import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';
import fixture from '../fixtures/accordion.json';
import _ from 'lodash';

describe('Accordion', () => {
  let Page = Factory.build(elements, fixture, fixture)[0];
  let page = TestUtils.renderIntoDocument(Page);
  let dom = React.findDOMNode(page);
  let accordion = dom.childNodes[2];
  let panel1Container = accordion.childNodes[0];
  let panel2Container = accordion.childNodes[1];

  it('renders a bootstrap accordion', () => {
    expect(accordion.id).toEqual('accordion');
    expect(accordion.className).toEqual('panel-group');
  });

  it('can render collapsible panels as its children with the first panel expanded by default', () => {
    expect(panel1Container.childNodes[0].className).toEqual('panel-heading');
    expect(panel1Container.childNodes[1].className).toEqual('panel-collapse collapse in');
    expect(panel2Container.childNodes[1].className).toEqual('panel-collapse collapse');
  });

  it('can be configured for any panel to be expanded by default', () => {
    let updatedFixture = _.set(fixture, 'components.accordion.config.defaultActiveKey', 1);
    let Page = Factory.build(elements, updatedFixture, updatedFixture)[0];
    let page = TestUtils.renderIntoDocument(Page);
    let dom = React.findDOMNode(page);
    let accordion = dom.childNodes[2];
    let panel2Container = accordion.childNodes[1];
    expect(panel2Container.childNodes[1].className).toEqual('panel-collapse collapse in');
  });

});
