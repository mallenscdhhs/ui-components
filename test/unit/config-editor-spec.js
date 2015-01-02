var React = require('react/addons');
var Components = require('../../src/main');
var TestUtils = React.addons.TestUtils;
var fixture = require('../fixtures/config-editor-form.json');

describe('ConfigEditor', function(){

  beforeEach(function(){    
    var ConfEdt = Components.factory(fixture);
    this.component = TestUtils.renderIntoDocument(ConfEdt);    
  });

  it('can render a modal', function(){
    expect(this.component.getDOMNode().className).toEqual('modal fade');
  });

  it('can render a form with input data', function(){    
    var form = TestUtils.findRenderedDOMComponentWithTag(this.component, 'form');
    var fields  = TestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
    expect(fields.length).toEqual(1);
    expect(fields[0].getDOMNode().value).toEqual('bar');
  });

  it('maintains the changed state of the component config it is editing', function(done){
    var form = TestUtils.findRenderedDOMComponentWithTag(this.component, 'form');
    var fields  = TestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
    var input = fields[0].getDOMNode();
    TestUtils.Simulate.change(input, {target:{value: 'fubu'}});
    setTimeout(function(){
      expect(this.component.state.label).toEqual('fubu');
      done();
    }.bind(this), 200);    
  });

});