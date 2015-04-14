var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');

describe('Content component', function() {

  it('renders a content', function () {
    var fixture = require('../fixtures/page-with-content.json');
    var Page = Components.factory(fixture);
    var page = TestUtils.renderIntoDocument(Page);
    var section = TestUtils.findRenderedDOMComponentWithTag(page, 'section');
    expect(section.getDOMNode().childNodes[0].textContent).toEqual('I am some ');
    expect(section.getDOMNode().childNodes[1].textContent).toEqual('content');
    expect(section.getDOMNode().childNodes[1].tagName).toEqual('B');
  });

});