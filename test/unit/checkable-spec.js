import React from 'react';
import Checkable from '../../src/Checkable';
import TestUtils from 'react/lib/ReactTestUtils';
import FieldLabel from '../../src/FieldLabel';

let renderer = TestUtils.createRenderer();

describe('Checkable', () => {

  it('can render a radio input', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'radio',
      value: 'yes',
      label: 'Are you a human?'
    };

    renderer.render(<Checkable {...fixture}/>);

    let output = renderer.getRenderOutput();
    let label = output.props.children;
    let input = label.props.children;
    expect(output.props.className).toEqual('radio-inline');
    expect(input.props.type).toEqual(fixture.type);
    expect(input.props.value).toEqual(fixture.value);
    expect(input.props.name).toEqual(fixture.name);
    expect(input.props.checked).toBe(false);
  });

  it('can render a checked radio input', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'radio',
      value: 'yes',
      checked: true,
      label: 'Are you a human?'
    };

    renderer.render(<Checkable {...fixture}/>);

    let output = renderer.getRenderOutput();
    let input = output.props.children.props.children;
    expect(input.props.type).toBe(fixture.type);
    expect(input.props.checked).toBe(true);
  });

  it('can render a checkbox input', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'checkbox',
      value: 'yes',
      label: 'Are you a human?'
    };

    renderer.render(<Checkable {...fixture}/>);

    let output = renderer.getRenderOutput();
    let label = output.props.children;
    let input = label.props.children;
    expect(output.props.className).toEqual('checkbox-inline');
    expect(input.props.type).toEqual(fixture.type);
    expect(input.props.value).toEqual(fixture.value);
    expect(input.props.name).toEqual(fixture.name);
    expect(input.props.checked).toBe(false);
  });

  it('can render a checked checkbox input', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'checkbox',
      value: 'yes',
      checked: true,
      label: 'Are you a human?'
    };

    renderer.render(<Checkable {...fixture}/>);

    let output = renderer.getRenderOutput();
    let input = output.props.children.props.children;
    expect(input.props.type).toBe(fixture.type);
    expect(input.props.checked).toBe(true);
  });

  it('can render a disabled input', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'radio',
      value: 'yes',
      checked: true,
      disabled: true,
      label: 'Are you a human?'
    };

    renderer.render(<Checkable {...fixture}/>);

    let output = renderer.getRenderOutput();
    let input = output.props.children.props.children;
    expect(input.props.type).toBe(fixture.type);
    expect(input.props.checked).toBe(true);
    expect(input.props.disabled).toBe(true);
  });

  it('can persist a radio value upon checking', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'radio',
      value: 'yes',
      label: 'Are you a human?'
    };

    let dom = TestUtils.renderIntoDocument(<Checkable {...fixture}/>);
    let event = {target: {checked: true}};
    dom.handleChange(event);
    expect(event.component).toBeDefined();
    expect(event.component.schemaUpdates.checked).toBe(true);
    expect(event.component.modelUpdates.value).toBe(fixture.value);
  });

  it('can persist a checkbox value upon checking', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'checkbox',
      value: 'yes',
      label: 'Are you a human?'
    };

    let dom = TestUtils.renderIntoDocument(<Checkable {...fixture}/>);
    let event = {target: {checked: true}};
    dom.handleChange(event);
    expect(event.component).toBeDefined();
    expect(event.component.schemaUpdates.checked).toBe(true);
    expect(event.component.modelUpdates.value).toBe(fixture.value);
  });

  it('will persist a null value if input is unchecked', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'checkbox',
      value: 'yes',
      checked: true,
      label: 'Are you a human?'
    };

    let dom = TestUtils.renderIntoDocument(<Checkable {...fixture}/>);
    let event = {target: {checked: false}};
    dom.handleChange(event);
    expect(event.component).toBeDefined();
    expect(event.component.schemaUpdates.checked).toBe(false);
    expect(event.component.modelUpdates.value).toBeNull();
  });

  it('will send component props on blur', () => {
    let fixture = {
      id: 'test',
      name: 'foo',
      type: 'checkbox',
      value: 'yes',
      checked: true,
      label: 'Are you a human?'
    };

    let dom = TestUtils.renderIntoDocument(<Checkable {...fixture}/>);
    let event = {};
    dom.handleBlur(event);
    expect(event.component).toBeDefined();
    expect(event.component.id).toEqual(fixture.id);
    expect(event.component.name).toEqual(fixture.name);
    expect(event.component.type).toEqual(fixture.type);
    expect(event.component.value).toEqual(fixture.value);
    expect(event.component.checked).toEqual(fixture.checked);
  });
});
