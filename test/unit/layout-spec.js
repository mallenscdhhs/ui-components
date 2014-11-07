var React = require('react/addons');
var Layout = require('../../dist/cjs/Layout');
var TestUtils = React.addons.TestUtils;

describe('Layout component', function(){
  it('is optional', function(){
    var layout = TestUtils.renderIntoDocument(<Layout components={[<p>foo</p>]}/>);
    var p = TestUtils.findRenderedDOMComponentWithTag(layout, 'p');
    expect(p.getDOMNode().textContent).toEqual('foo');
    expect(p.getDOMNode().parentNode.className).toEqual('components');
  });
  it('can render a list components with the given layout type');
});
