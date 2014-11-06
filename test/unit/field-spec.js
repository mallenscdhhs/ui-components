var React = require('react/addons');
var Field = require('../../src/Field.jsx');
var request = require('superagent');
var tu = React.addons.TestUtils;

describe('Field component', function() {

  var textFixture = {
    type : 'text',
    name : 'test-text',
    label : 'Test Text',
    required : false,
    options : { }
  };

  it('Renders field with label', function(){
    var field = tu.renderIntoDocument(<Field {...textFixture}/>);
    var label = tu.findRenderedDOMComponentWithClass(field, 'field-label');
    expect(label.getDOMNode().textContent).toEqual(textFixture.label);
  });

  it('Renders field with text input type', function(){
    var field = tu.renderIntoDocument(<Field {...textFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(field, 'input-text');
    expect(inputText.getDOMNode().type).toEqual(textFixture.type);
  });

});
