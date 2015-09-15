import React from 'react';
import Field from '../../src/Field';
import TestUtils from 'react/lib/ReactTestUtils';

let renderer = TestUtils.createRenderer();

describe('Field', () => {

  it('can render a checkbox', () => {
    let fixture = {
      type: 'checkbox',
      id: 'test',
      name: 'kidding_question',
      value: 'yes',
      checked: true,
      label: 'Are you kidding me?'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0].childNodes[0];
    let input = label.childNodes[0];
    expect(dom.tagName).toEqual('DIV');
    expect(dom.className).toEqual('form-group');
    expect(label.getAttribute('for')).toEqual(fixture.id);
    expect(label.childNodes[1].textContent).toEqual(fixture.label);
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.getAttribute('value')).toEqual(fixture.value);
    expect(input.checked).toEqual(fixture.checked);

    // renders as unchecked
    fixture.checked = false;
    component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    input = React.findDOMNode(input);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.checked).toBe(false);
  });

  it('can render a radio', () => {
    let fixture = {
      type: 'radio',
      id: 'test',
      name: 'kidding_question',
      value: 'yes',
      checked: true,
      label: 'Are you kidding me?'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0].childNodes[0];
    let input = label.childNodes[0];
    expect(dom.tagName).toEqual('DIV');
    expect(dom.className).toEqual('form-group');
    expect(label.getAttribute('for')).toEqual(fixture.id);
    expect(label.childNodes[1].textContent).toEqual(fixture.label);
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.getAttribute('value')).toEqual(fixture.value);
    expect(input.checked).toEqual(fixture.checked);

    // renders as unchecked
    fixture.checked = false;
    component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    input = React.findDOMNode(input);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.checked).toBe(false);
  });

  it('can render a text field', () => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0];
    let input = dom.childNodes[1];
    expect(dom.tagName).toEqual('DIV');
    expect(dom.className).toEqual('form-group');
    expect(label.getAttribute('for')).toEqual(fixture.id);
    expect(label.childNodes[0].childNodes[0].textContent).toEqual(fixture.label);
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.getAttribute('value')).toBeNull();
  });

  it('can render a textarea', () => {
    let fixture = {
      type: 'textarea',
      id: 'test',
      name: 'motto',
      label: 'Life motto',
      value: 'I like React.'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0];
    let input = dom.childNodes[1];
    expect(dom.tagName).toEqual('DIV');
    expect(dom.className).toEqual('form-group');
    expect(label.getAttribute('for')).toEqual(fixture.id);
    expect(label.childNodes[0].childNodes[0].textContent).toEqual(fixture.label);
    expect(input.tagName).toEqual('TEXTAREA');
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.textContent).toEqual(fixture.value);
  });

  it('can render a select', () => {
    let fixture = {
      type: 'select',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      options: [
        {value: 'foo', label: 'Foo'}
      ]
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0];
    let input = dom.childNodes[1];
    expect(dom.tagName).toEqual('DIV');
    expect(dom.className).toEqual('form-group');
    expect(label.getAttribute('for')).toEqual(fixture.id);
    expect(label.childNodes[0].childNodes[0].textContent).toEqual(fixture.label);
    expect(input.tagName).toEqual('SELECT');
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.getAttribute('value')).toBeNull();
    expect(input.childNodes.length).toBe(1);
    expect(input.childNodes[0].getAttribute('value')).toEqual(fixture.options[0].value);
    expect(input.childNodes[0].textContent).toEqual(fixture.options[0].label);
  });

  it('can render a disabled field', () => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John',
      disabled: true
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let input = dom.childNodes[1];
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.disabled).toEqual(fixture.disabled);
  });

  it('can render a help text', () => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John',
      helpText: 'Oh hai!'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0];
    let input = dom.childNodes[1];
    let message = dom.childNodes[2];
    expect(dom.className).toEqual('form-group');
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(input.getAttribute('value')).toEqual(fixture.value);
    expect(message.className).toEqual('help-block');
    expect(message.textContent).toEqual(fixture.helpText);
  });

  it('can render a validation error', () => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John',
      hasError: true,
      message: 'Oh noes!'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let dom = React.findDOMNode(component);
    let label = dom.childNodes[0];
    let input = dom.childNodes[1];
    let message = dom.childNodes[2];
    expect(dom.className).toEqual('form-group has-error');
    expect(input.getAttribute('type')).toEqual(fixture.type);
    expect(input.getAttribute('name')).toEqual(fixture.name);
    expect(message.className).toEqual('help-block');
    expect(message.textContent).toEqual(fixture.message);
  });

  it('can handle change event', () => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let event = {target: {value: 'Johnny'}};
    component.handleChange(event);
    expect(event.component).toBeDefined();
    expect(event.component.id).toEqual(fixture.id);
    expect(event.component.modelUpdates).toBeDefined();
    expect(event.component.modelUpdates.value).toEqual('Johnny');
    expect(event.component.modelUpdates.id).toEqual(fixture.name);
  });

  it('can handle blur event', () => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let event = {};
    component.handleBlur(event);
    expect(event.component).toBeDefined();
    expect(event.component.id).toEqual(fixture.id);
    expect(event.component.name).toEqual(fixture.name);
    expect(event.component.type).toEqual(fixture.type);
  });

  it('can handle change events for radios/checkboxes', () => {
    let fixture = {
      type: 'checkbox',
      id: 'test',
      name: 'testbox',
      label: 'Are you in?',
      value: 'yes'
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let event = {target: {checked: true}};
    component.handleChange(event);
    expect(event.component).toBeDefined();
    expect(event.component.id).toEqual(fixture.id);
    expect(event.component.schemaUpdates).toBeDefined();
    expect(event.component.schemaUpdates.checked).toBe(true);
    expect(event.component.modelUpdates).toBeDefined();
    expect(event.component.modelUpdates.value).toEqual('yes');
    expect(event.component.modelUpdates.id).toEqual(fixture.name);
  });
});
