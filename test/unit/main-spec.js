var TestUtils = React.addons.TestUtils; 

describe('main component', function(){
  describe('#factory', function(){
    it('can build the ReactElement DOM from schema', function(){
      var fixture = require('../fixtures/main.json');      
      var Comp = Components.factory(fixture);
      var page = TestUtils.renderIntoDocument(Comp);
      expect(page.getDOMNode()).toBeDefined();
    });
    it('will create a copy of the passed-in data', function(){
      var fixture = require('../fixtures/main.json');      
      var Comp = Components.factory(fixture);
      expect(fixture.components.test_field_1.config.component_id).not.toBeDefined();
    })
    it('will throw an error if no componentHead is supplied with a components list', function(){
      var fixture = require('../fixtures/main-no-componentHead.json');
      expect(Components.factory.bind(null, fixture)).toThrow();
    });
  });
  describe('#buildComponentTree', function(){
    it('can build a nested data structure for rendering Component tree', function(){
      var fixture = require('../fixtures/main.json');      
      var page = Components.buildComponentTree(fixture, fixture)[0]._store.props;
      expect(page.children.length).toEqual(2);
      var form = page.children[0]._store.props;
      expect(form.children.length).toEqual(1);
      var fieldset = form.children[0]._store.props;      
      expect(fieldset.children.length).toEqual(1);
      var fieldsetLayout = fieldset.children[0]._store.props;
      expect(fieldsetLayout.children.length).toEqual(2);
      var field1 = fieldsetLayout.children[0]._store.props;
      var field2 = fieldsetLayout.children[1]._store.props;
      var action = page.children[1]._store.props;
       
      expect(form.id).toEqual('test_form');
      expect(fieldset.id).toEqual('test_fieldset');
      expect(field1.id).toEqual('test_field_1');
      expect(field2.id).toEqual('test_field_2');
      expect(action.id).toEqual('action_1');
    });
  });
});