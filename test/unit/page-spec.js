var React = require('react');
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');

describe('Page component', function() {

  it('renders a page with a title and content', function(){
    var fixture = require('../fixtures/page-with-content.json');
    var Page = Components.factory(fixture);
    var page = TestUtils.renderIntoDocument(Page);
    var h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    var section = TestUtils.findRenderedDOMComponentWithTag(page, 'section');
    expect(section).toBeDefined();
    expect(h2.getDOMNode().textContent).toEqual(fixture.config.title);
  });

  it('renders a list of components', function(){
    var config = require('../fixtures/page-with-layout.json');
    var Page = Components.factory(config);
    var p = TestUtils.renderIntoDocument(Page);
    var cols = TestUtils.scryRenderedDOMComponentsWithClass(p, 'col-md-6');
    expect(cols.length).toEqual(2);
  });

  it('can use a layout config to arrange its components', function(){
    var config = require('../fixtures/page-with-layout.json');
    var Page = Components.factory(config);
    var page = TestUtils.renderIntoDocument(Page);
    var gl = TestUtils.findRenderedDOMComponentWithClass(page, 'grid-layout');
    var row = gl.getDOMNode().childNodes[0];
    expect(row.className).toEqual('row');
    expect(row.childNodes.length).toEqual(2);
  });

});
