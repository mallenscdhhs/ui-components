var React = require('react');
var Components = require('../../src/main');
var TestUtils = require('react/lib/ReactTestUtils');
var config = require('../../src/configuration');

describe('main component', function(){
  it('exposes the list of elements', function(){
    expect(Components.elements).toBeDefined();
  });
  it('exposes the constants', function(){
    expect(Components.constants).toBeDefined();
  });
  it('allows for configuration', function(){
    expect(Components.configure).toBeDefined();
    Components.configure({foo: 'bar'});
    expect(config.foo).toEqual('bar');
  });
  describe('#factory', function(){
    it('can build the ReactElement DOM from schema', function(){
      var fixture = require('../fixtures/main.json');
      var Comp = Components.factory(fixture);
      var page = TestUtils.renderIntoDocument(Comp);
      expect(page.getDOMNode()).toBeDefined();
    });
  });
});
