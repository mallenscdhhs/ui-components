import React from 'react';
import Modal from '../../src/Modal';
import TestUtils from 'react/lib/ReactTestUtils';

describe('Modal', function(){
  it('renders a hidden modal window', function(){
    let config = { title: 'Foo title', id: 'foo'};
    let m = TestUtils.renderIntoDocument(<Modal {...config}><p>Hi.</p></Modal>);
    let md = m.getDOMNode();
    let p = TestUtils.findRenderedDOMComponentWithTag(m, 'p');
    expect(md.id).toEqual(config.id);
    expect(/in/.test(md.className)).toEqual(false);
    expect(p.getDOMNode().textContent).toEqual('Hi.');
  });
  it('can autoshow a modal window', function(done){
    let config = { title: 'Foo title', id: 'foo', show: true};
    let m = TestUtils.renderIntoDocument(<Modal {...config}><p>Hi.</p></Modal>);
    setTimeout(function(){
      expect(/in/.test(m.getDOMNode().className)).toEqual(true);
      done();
    }, 300);
  });
});
