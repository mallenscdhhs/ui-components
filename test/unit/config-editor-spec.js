describe('ConfigEditor', function(){
  var TestUtils = React.addons.TestUtils;
  var fixture = require('../fixtures/config-editor-form.json');
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
});