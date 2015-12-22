import React from 'react';
import Field from '../../src/Field';
import TestUtils from 'react-addons-test-utils';
import ComponentWrapper from '../ComponentWrapper';

let renderer = TestUtils.createRenderer();

describe('Field', () => {

  it('can render a checkbox', () => {
    let fixture = {
      type: 'checkbox',
      id: 'test',
      name: 'kidding_question',
      value: 'yes',
      submitValue: 'yes',
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
    expect(input.checked).toEqual(true);

    // renders as unchecked
    fixture.value = null;
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
      submitValue: 'yes',
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
    expect(input.checked).toEqual(true);

    // renders as unchecked
    fixture.value = null;
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
    expect(input.childNodes.length).toBe(2);
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

  it('can handle change event', (done) => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John'
    };

    let handler = (event) => {
      expect(event.component).toBeDefined();
      expect(event.component.id).toEqual(fixture.id);
      expect(event.component.modelUpdates).toBeDefined();
      expect(event.component.modelUpdates[fixture.name]).toEqual('Johnny');
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <ComponentWrapper onChange={handler}>
        <Field {...fixture}/>
      </ComponentWrapper>
    );

    let event = {target: {value: 'Johnny'}};
    let node = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    TestUtils.Simulate.change(node, event);
  });

  it('can handle blur event', (done) => {
    let fixture = {
      type: 'text',
      id: 'test',
      name: 'firstName',
      label: 'First name',
      value: 'John'
    };

    let handler = (event) => {
      expect(event.component).toBeDefined();
      expect(event.component.id).toEqual(fixture.id);
      expect(event.component.name).toEqual(fixture.name);
      expect(event.component.type).toEqual(fixture.type);
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <ComponentWrapper onBlur={handler}>
        <Field {...fixture}/>
      </ComponentWrapper>
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    TestUtils.Simulate.blur(input, {});
  });

  it('can handle change events for radios/checkboxes', (done) => {
    let fixture = {
      type: 'checkbox',
      id: 'test',
      name: 'testbox',
      label: 'Are you in?',
      value: 'yes',
      submitValue: 'yes'
    };

    let handler = (event) => {
      expect(event.component).toBeDefined();
      expect(event.component.id).toEqual(fixture.id);
      expect(event.component.schemaUpdates).toBeDefined();
      expect(event.component.schemaUpdates.checked).toBe(true);
      expect(event.component.modelUpdates).toBeDefined();
      expect(event.component.modelUpdates[fixture.name]).toEqual('yes');
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <ComponentWrapper onChange={handler}>
        <Field {...fixture}/>
      </ComponentWrapper>
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    TestUtils.Simulate.change(input, {target: {checked: true}});

  });

  it('can mask input', (done) => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'text',
      value: '123456789',
      mask: 'phone'
    };

    let handler = (event) => {
      expect(event.component.modelUpdates[fixture.name]).toBe('1234567890');
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <ComponentWrapper onChange={handler}>
        <Field {...fixture}/>
      </ComponentWrapper>
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    let dom = React.findDOMNode(input);
    expect(dom.value).toBe('123-456-789');
    expect(component.props.children.props.value).toBe('123456789');

    TestUtils.Simulate.change(dom, {target: {value: '123-456-7890'}});
  });

  xit('can handle backspaces in masked inputs', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'text',
      value: '1234567890',
      mask: 'phone'
    };

    let handler = (event) => {
      expect(event.component.modelUpdates.value).toBe('123456789');
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <ComponentWrapper onKeyUp={handler}>
        <Field {...fixture}/>
      </ComponentWrapper>
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    let dom = React.findDOMNode(input);
    expect(dom.value).toBe('123-456-7890');
    expect(component.props.children.props.value).toBe('1234567890');

    TestUtils.Simulate.keyDown(dom, {
      keyCode: 8,
      preventDefault() {}
    });
  });

  it('can force max length', (done) => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'text',
      value: '1234567890',
      min: 10,
      max: 10
    };

    let handler = (event) => {
      expect(event.component.modelUpdates[fixture.name]).toBe('1234567890');
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <ComponentWrapper onChange={handler}>
        <Field {...fixture}/>
      </ComponentWrapper>
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    let dom = React.findDOMNode(input);
    expect(dom.value).toBe('1234567890');
    expect(component.props.children.props.value).toBe('1234567890');

    TestUtils.Simulate.change(dom, {target: {value: '12345678901'}});
  });

  it('can force manual input', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'text',
      forceManualInput: true
    };

    let component = TestUtils.renderIntoDocument(<Field {...fixture}/>);
    let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    let dom = React.findDOMNode(input);
    expect(input.props.autoComplete).toBe('off');
  });
});
