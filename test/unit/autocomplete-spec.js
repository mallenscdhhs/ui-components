require('es6-promise').polyfill();
var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var AutoComplete = require('../../src/AutoComplete');
var constants = require('../../src/constants');
var Dispatcher = require('fluxify').dispatcher;

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

  it('will call FIELD_VALUE_CHANGE action after user selection', function(done){
    var node = component.refs.typeahead.refs.entry.getDOMNode();
    node.value = 'f';
    TestUtils.Simulate.change(node);
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(component, 'list-group-item');
    expect(listItems.length).toEqual(2);

    Dispatcher.register(function(action){
      if ( action.actionType === constants.actions.FIELD_VALUE_CHANGE ) {
        expect(action.data.value).toEqual('four');
        done();
      }
    });

    TestUtils.Simulate.click(listItems[0].getDOMNode());
  });
});
