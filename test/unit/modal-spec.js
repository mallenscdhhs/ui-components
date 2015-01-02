var React = require('react/addons');
var Components = require('../../src/main');

describe('Modal', function(){
  var Modal = Components.elements['modal'];
  it('renders a hidden modal window', function(){
    var config = { title: 'Foo title', id: 'foo'};
    var m = React.addons.TestUtils.renderIntoDocument(<Modal {...config}><p>Hi.</p></Modal>);
    var md = m.getDOMNode();    
    var p = React.addons.TestUtils.findRenderedDOMComponentWithTag(m, 'p');
    expect(md.id).toEqual(config.id);
    expect(/in/.test(md.className)).toEqual(false);
    expect(p.getDOMNode().textContent).toEqual('Hi.');
  });
  it('can autoshow a modal window', function(done){
    var config = { title: 'Foo title', id: 'foo', autoShow: true};
    var m = React.addons.TestUtils.renderIntoDocument(<Modal {...config}><p>Hi.</p></Modal>);
    setTimeout(function(){
      expect(/in/.test(m.getDOMNode().className)).toEqual(true);
      done();
    }, 300);    
  });
});