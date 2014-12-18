describe('ConfigEditor', function(){
  it('can render a modal');
  it('can render a form with input data', function(){
    var fixture = require('../fixtures/config-editor-form.json');
    var ConfEdt = Components.factory(fixture);
    var comp = React.addons.TestUtils.renderIntoDocument(ConfEdt);
    
  });  
});