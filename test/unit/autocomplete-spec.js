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
  var inpt = TestUtils.findRenderedDOMComponentWithClass(component, 'rw-input');
  var inptDom = inpt.getDOMNode();

  it('can render', function(done){
    expect(dom.className).toEqual('field-autocomplete rw-combobox rw-widget');
    expect(inptDom.className).toEqual('rw-input rw-input');
    setTimeout(function(){
      expect(component.state.options.length).toEqual(5);
      done();
    }, 300);
  });

  it('will update options based on input value', function(){
    component = TestUtils.renderIntoDocument(<AutoComplete {...fixture.config} value='f'/>);
    var compBtn = TestUtils.findRenderedDOMComponentWithClass(component, 'rw-select');
    TestUtils.Simulate.click(compBtn);
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(component, 'rw-list-option');

    expect(listItems.length).toEqual(2);
  });

  it('will call FIELD_VALUE_CHANGE action after user selection', function(done){
    var node = inptDom;
    node.value = 'f';
    TestUtils.Simulate.change(node);

    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(component, 'rw-list-option');
    console.log('listItems', listItems[0].getDOMNode());

    Dispatcher.register('ac-test', function(action,data){
      if ( action === constants.actions.FIELD_VALUE_CHANGE ) {
        expect(data.value).toEqual('four');
        done();
        Dispatcher.unregister('ac-test');
      }
    });

    TestUtils.Simulate.click(listItems[0].getDOMNode());
  });
});
