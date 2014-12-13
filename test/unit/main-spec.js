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
    it('will add a component_id to every config', function(){
      var fixture = require('../fixtures/main.json');      
      var Comp = Components.factory(fixture);
      expect(Comp._store.props.component_id).toEqual('pi');
      expect(Comp._store.props.children[0]._store.props.component_id).toEqual('test_form');
      expect(Comp._store.props.children[0]._store.props.children[0]._store.props.component_id).toEqual('test_fieldset');
    });
    it('will throw an error if no componentHead is supplied with a components list', function(){
      var fixture = require('../fixtures/main-no-componentHead.json');
      expect(Components.factory.bind(null, fixture)).toThrow();
    });
  });
  describe('#buildComponentTree', function(){
    it('can build a nested data structure for rendering Component tree', function(){
      var fixture = require('../fixtures/main.json');      
      var tree = Components.buildComponentTree(
        fixture.components, 
        fixture.components[fixture.componentHead]
      );   
      expect(tree.length).toEqual(2);
      expect(tree[0].components.length).toEqual(1);
      expect(tree[0].id).toEqual('test_form');
      expect(tree[0].components[0].components.length).toEqual(2);
      expect(tree[0].components[0].id).toEqual('test_fieldset');
      expect(tree[0].components[0].components[0].id).toEqual('test_field_1');
      expect(tree[0].components[0].components[1].id).toEqual('test_field_2');      
      expect(tree[1].id).toEqual('action_1');
    });
  });
});