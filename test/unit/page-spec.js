var React = require('react/addons');
var Page = require('../../dist/cjs/Page');
var request = require('superagent');
var TestUtils = React.addons.TestUtils;

describe('Page component', function() {

  var fixture = {
    title: 'Hello',
    content: [
      {
        type: "p",
        config: {
          text: "hello, world"
        }
      }
    ],
    components: [
      {
        type: 'div',
        config: {
          textContent: 'hello'
        }
      }
    ]
  };

  it('renders a page with a title', function(){
    var page = TestUtils.renderIntoDocument(<Page title={fixture.title}/>);
    var h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    expect(h2.getDOMNode().textContent).toEqual(fixture.title);
  });

  it('renders a page with content', function(){
    var page = TestUtils.renderIntoDocument(<Page title={fixture.title} content={fixture.content} />);
    var p = TestUtils.findRenderedDOMComponentWithTag(page, 'p');
    expect(p.getDOMNode().textContent).toEqual(fixture.content[0].config.text);
  });

  it('will re-render itself if its state changes', function(){
    var page = TestUtils.renderIntoDocument(<Page title={fixture.title} content={fixture.content} />);
    var h2 = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
    var p = TestUtils.findRenderedDOMComponentWithTag(page, 'p');
    expect(h2.getDOMNode().textContent).toEqual(fixture.title);
    expect(p.getDOMNode().textContent).toEqual(fixture.content[0].config.text);
    page.setState({title: 'bye', content: [{type: 'p', config: { text: 'foo' }}]});
    expect(p.getDOMNode().textContent).toEqual('foo');
    expect(h2.getDOMNode().textContent).toEqual('bye');
  });

  it('renders a list of components');
  it('can use a layout config to arrange its components');

  it('can load its state from a server', function(){
    spyOn(request, 'get');
    var page = TestUtils.renderIntoDocument(<Page url="lib/data/page-config.json"/>);
    expect(request.get.calls.count()).toEqual(1);
    expect(request.get.calls.argsFor(0)[0]).toEqual('lib/data/page-config.json');
  });

});
