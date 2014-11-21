describe('Form component', function() {
  var tu = React.addons.TestUtils;
  var Form = Components.elements.form;
  var formFixture = {
    'name' : 'Test Form',
    'model' : {},
    'actions':[
      {
        'type' : 'link',            
        'config' : {
          'name' : 'Test Action',
          'url' : 'testURLHTTP'              
        }
      },
      {
        'type' : 'button',            
        'config' : {
          'name' : 'Test Action',
          'url' : 'testURLHTTP'              
        }
      }
    ],
    'rules': [],
    'layout' : {
      'type': "grid", 
      'config': {
        'rows': [[{'md': '6'}]]
      }
    },
    'components' :[{
      'type' : 'fieldset',
      'config':{
        'name' : 'Test Fieldset',
        'layout' : {
          'type': "grid", 
          'config': {
            'rows': [[{'md': '4', 'sm': '2'}]]
          }
        },
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
      }  
    }]  
  };

  it('Renders form container', function(){
    var formPage = tu.renderIntoDocument(<Form {...formFixture}/>);
    var inputText = tu.scryRenderedDOMComponentsWithTag(formPage, 'form');
    expect(inputText.length).toEqual(1);    
  });

});
