var React = require('react/addons');
var Fieldset = require('../../dist/cjs/Fieldset');

var request = require('superagent');
var _ = require('underscore');
var tu = React.addons.TestUtils;

describe('Fieldset component', function() {

  var fieldsetFixture = {
    'name' : 'Test Legend',
    'layout' : {},
    'components' :[{
      'type' :'field',
      'config' : { 
        'type' : 'text',
        'name' : 'test-text',
        'label' : 'Test Text',
        'required' : false,
        'options' : { }
      }
    }]  
  };

  it('Renders fieldset legend', function(){
    var fieldset = tu.renderIntoDocument(<Fieldset {...fieldsetFixture}/>);
    var legend = tu.findRenderedDOMComponentWithTag(fieldset, 'legend');
    expect(legend.getDOMNode().textContent).toEqual(fieldsetFixture.name);
  });

  it('Renders fieldset fields', function(){
    var fieldset = tu.renderIntoDocument(<Fieldset {...fieldsetFixture}/>);
    var inputText = tu.findRenderedDOMComponentWithClass(fieldset, 'form-control');
    expect(inputText.getDOMNode().type).toEqual(fieldsetFixture.components[0].config.type);    
  });
  

});
