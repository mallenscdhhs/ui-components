var React = require('react/addons');
var Components = require('../../src/main');
var TestUtils = React.addons.TestUtils;

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