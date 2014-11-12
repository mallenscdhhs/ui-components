var React = require('react/addons');
var Page = require('../../dist/cjs/Page');
var request = require('superagent');
var TestUtils = React.addons.TestUtils;
var _ = require('underscore');

describe('Page component', function() {

  var fixture = {
    title: 'Hello',
    content: "hello, **world**",
    components: [
      {
        type: 'form',
        config: {          
        }
      }
    ]
  };

  it('renders a page with a title', function(){
    var page = TestUtils.renderIntoDocument(<Page title={fixture.title}/>);
    var h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    expect(h2.getDOMNode().textContent).toEqual(fixture.title);
  });

  it('renders a page with markdown content', function(){
    var page = TestUtils.renderIntoDocument(<Page title={fixture.title} content={fixture.content} />);
    var section = TestUtils.findRenderedDOMComponentWithTag(page, 'section');
    expect(section.getDOMNode().childNodes[0].textContent).toEqual('hello, world');
    expect(section.getDOMNode().childNodes[0].childNodes[1].tagName).toEqual('STRONG');
  });

  it('will re-render itself if its state changes', function(){
    var page = TestUtils.renderIntoDocument(<Page title={fixture.title} content={fixture.content} />);
    var h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    var p = TestUtils.findRenderedDOMComponentWithTag(page, 'section').getDOMNode().childNodes[0];
    expect(h2.getDOMNode().textContent).toEqual(fixture.title);
    expect(p.textContent).toEqual('hello, world');
    page.setState({title: 'bye', content: 'hi'});
    expect(h2.getDOMNode().textContent).toEqual('bye');
    expect(TestUtils.findRenderedDOMComponentWithTag(page, 'section').getDOMNode().childNodes[0].textContent).toEqual('hi');    
  });

  it('renders a list of components');
  
  it('can use a layout config to arrange its components', function(){
    var fix = _.extend({
      layout: {
        type: 'grid',
        config: {
          rows: [[{md: '4'}, {md: '4'}]]
        }
      }
    }, fixture);
    var page = TestUtils.renderIntoDocument(React.createElement(Page, fix));
    var h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    var p = TestUtils.findRenderedDOMComponentWithTag(page, 'section').getDOMNode().childNodes[0];
    var gl = TestUtils.findRenderedDOMComponentWithClass(page, 'grid-layout');
    var row = gl.getDOMNode().childNodes[0];
    expect(h2.getDOMNode().textContent).toEqual(fix.title);
    expect(p.textContent).toEqual('hello, world');
    expect(row.className).toEqual('row');
  });

  it('can load its state from a server', function(){
    spyOn(request, 'get');
    var page = TestUtils.renderIntoDocument(<Page url="lib/data/page-config.json"/>);
    expect(request.get.calls.count()).toEqual(1);
    expect(request.get.calls.argsFor(0)[0]).toEqual('lib/data/page-config.json');
  });

});
