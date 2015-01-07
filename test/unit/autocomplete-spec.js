var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var AutoComplete = require('../../src/AutoComplete');

describe('AutoComplete', function(){
  var fixture = require('../fixtures/autocomplete.json');
  var component = TestUtils.renderIntoDocument(<AutoComplete {...fixture.config}/>);
  var dom = component.getDOMNode();
  var inpt = TestUtils.findRenderedDOMComponentWithClass(component, 'form-control');
  var inptDom = inpt.getDOMNode();

  it('can render', function(done){
    expect(dom.className).toEqual('typeahead field-autocomplete');
    expect(inptDom.className).toEqual('form-control');
    setTimeout(function(){
      expect(component.refs.typeahead.state.options.length).toEqual(5);
      done();
    }, 300);
  });
});
