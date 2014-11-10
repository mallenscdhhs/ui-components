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

  it('can render a list components with the given layout type', function(){
  	var config = {rows: [[{md: '4', sm: '2'}]]};
  	var layout = TestUtils.renderIntoDocument(<Layout type="grid" config={config} components={[<p>foo</p>]}/>);  	
  	var gl = TestUtils.findRenderedDOMComponentWithClass(layout, 'grid-layout');
  	expect(layout.getDOMNode().className).toEqual('layout');
  	expect(gl.getDOMNode().childNodes[0].className).toEqual('row');
  	expect(gl.getDOMNode().childNodes[0].childNodes[0].className).toEqual('col-md-4 col-sm-2');
  });
});
