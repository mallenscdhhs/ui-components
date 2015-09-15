var React = require('react');
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');

describe('main component', function(){
  it('exposes the list of elements', function(){
    expect(Components.elements).toBeDefined();
  });
  it('exposes the constants', function(){
    expect(Components.constants).toBeDefined();
  });
});
