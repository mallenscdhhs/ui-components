var React = require('react/addons');
var Input = require('../../src/Input');
var fixture = require('../fixtures/field-text.json');

describe('Input', function(){
  
  it('can render a text input', function(){
    var comp = React.addons.TestUtils.renderIntoDocument(<Input {...fixture}/>);
    var dom = comp.getDOMNode();
    expect(dom.tagName.toLowerCase()).toEqual('input');
    expect(dom.type).toEqual(fixture.type);
    expect(dom.name).toEqual(fixture.name);
    expect(dom.id).toEqual(fixture.id);
    expect(dom.getAttribute('disabled')).toBeNull();
  });

  it('can render a disabled text input', function(){
    var config = React.addons.update(fixture, {disabled: {$set: true}});
    var comp = React.addons.TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    expect(dom.getAttribute('disabled')).toBeDefined();
  });
  
  it('can set a "maxLength" attribute', function(){
    var max = 10;
    var config = React.addons.update(fixture, {maxLength: {$set: max}});
    var comp = React.addons.TestUtils.renderIntoDocument(<Input {...config}/>);
    var dom = comp.getDOMNode();
    expect(dom.maxLength).toEqual(max);    
  });
  
});