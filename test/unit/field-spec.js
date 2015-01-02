var React = require('react/addons');
var Field = require('../../src/Field');
var TestUtils = React.addons.TestUtils;
var fixture = require('../fixtures/field-text.json');
var EQ = require('../../src/EventQueue');

describe('Field component', function() {

  it('can manage viewable state', function(){
    var dep = {
      initialState: 'hidden',
      id: 'testfield',
      value: 'bar'
    };
    var config = React.addons.update(fixture, {
      value: { $set: 'foo' },
      dependency: { $set: dep }
    });
    var comp = TestUtils.renderIntoDocument(<Field {...config}/>);
    var dom = comp.getDOMNode();
    expect(/hidden/.test(dom.className)).toEqual(true);
  });
  
  it('can render error messages', function(done){
    var comp = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    EQ.push({ 
      entityEvent: 'field:error:'+fixture.id, 
      data: {
        hasError: true, 
        errorMessage: 'It broke.'
      } 
    });
    setTimeout(function(){
      var helpBlock = TestUtils.findRenderedDOMComponentWithClass(comp, 'help-block');
      expect(helpBlock.getDOMNode().textContent).toEqual('It broke.');
      expect(/error/.test(comp.getDOMNode().className)).toEqual(true);
      done();
    }, 300);
  });
  
  it('can render a FieldGroup', function(){
    var config = require('../fixtures/field-group.json');
    var comp = TestUtils.renderIntoDocument(<Field {...config}/>);
    var lgnd = TestUtils.findRenderedDOMComponentWithTag(comp, 'legend');
    var inpts = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    expect(comp.getDOMNode().tagName.toLowerCase()).toEqual('fieldset');
    expect(lgnd.getDOMNode().textContent).toEqual(config.label);
    expect(inpts.length).toEqual(3);
  });
});
