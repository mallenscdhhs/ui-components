import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';

describe('Content component', function() {

  it('renders a content', function () {
    let fixture = require('../fixtures/page-with-content.json');
    let Page = Factory.build(elements, fixture, fixture)[0];
    let page = TestUtils.renderIntoDocument(Page);
    let section = TestUtils.findRenderedDOMComponentWithTag(page, 'section');
    expect(section.getDOMNode().childNodes[0].textContent).toEqual('I am some ');
    expect(section.getDOMNode().childNodes[1].textContent).toEqual('content');
    expect(section.getDOMNode().childNodes[1].tagName).toEqual('B');
  });

});
