import React from 'react';
import elements from '../../src/index';
import Factory from '../../src/Factory';
import TestUtils from 'react/lib/ReactTestUtils';

let layoutFixture = require('../fixtures/page-with-layout.json');
let contentFixture = require('../fixtures/page-with-content.json');

describe('Page component', function() {

  it('renders a page with a title and content', function(){
    let Page = Factory.build(elements, contentFixture, contentFixture)[0];
    let page = TestUtils.renderIntoDocument(Page);
    let h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    let section = TestUtils.findRenderedDOMComponentWithTag(page, 'section');
    expect(section).toBeDefined();
    expect(h2.getDOMNode().textContent).toEqual(contentFixture.config.title);
  });

  it('renders a list of components', function(){
    let Page = Factory.build(elements, layoutFixture, layoutFixture)[0];
    let p = TestUtils.renderIntoDocument(Page);
    let cols = TestUtils.scryRenderedDOMComponentsWithClass(p, 'col-md-6');
    expect(cols.length).toEqual(2);
  });

  it('can use a layout config to arrange its components', function(){
    let Page = Factory.build(elements, layoutFixture, layoutFixture)[0];
    let page = TestUtils.renderIntoDocument(Page);
    let gl = TestUtils.findRenderedDOMComponentWithClass(page, 'grid-layout');
    let row = gl.getDOMNode().childNodes[0];
    expect(row.className).toEqual('row');
    expect(row.childNodes.length).toEqual(2);
  });

});
