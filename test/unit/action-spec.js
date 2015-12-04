import React from 'react';
import Action from '../../src/Action';
import TestUtils from 'react-addons-test-utils';

let renderer = TestUtils.createRenderer();

describe('Action component', () => {

  it('renders a default button', () => {
    let fixture = {
      id: 'test',
      label: 'Test'
    };

    renderer.render(<Action {...fixture}/>);
    let output = renderer.getRenderOutput();
    let action = output.props.children;
    expect(output.props.className).toBe('pull-left');
    expect(action.props.bsStyle).toBe('default');
    expect(action.props.children[1]).toEqual(fixture.label);
  });

  it('can pull a button to the right', () => {
    let fixture = {
      id: 'test',
      label: 'Test',
      align: 'right'
    };

    renderer.render(<Action {...fixture}/>);
    let output = renderer.getRenderOutput();
    expect(output.props.className).toBe('pull-right');
  });

  it('can have an icon', () => {
    let fixture = {
      id: 'test',
      label: 'Test',
      iconClass: 'plus'
    };

    renderer.render(<Action {...fixture}/>);
    let output = renderer.getRenderOutput();
    let action = output.props.children;
    expect(action.props.children[0].props.glyph).toEqual(fixture.iconClass);
    expect(action.props.children[1]).toEqual(fixture.label);
  });

  it('can use custom styles and sizes', () => {
    let fixture = {
      id: 'test',
      label: 'Test',
      styleName: 'primary',
      size: 'large'
    };

    renderer.render(<Action {...fixture}/>);
    let output = renderer.getRenderOutput();
    let action = output.props.children;
    expect(action.props.bsStyle).toBe('primary');
    expect(action.props.bsSize).toBe('large');
  });

  it('will publish its props on click', () => {
    let fixture = {
      id: 'test',
      label: 'Test',
      name: 'submit',
      formId: 'form1'
    };

    let dom = TestUtils.renderIntoDocument(<Action {...fixture}/>);
    let event = {};
    dom.handleClick(event);
    expect(event.component).toBeDefined();
    expect(event.component.id).toEqual(fixture.id);
    expect(event.component.name).toEqual(fixture.name);
    expect(event.component.formId).toEqual(fixture.formId);
  });

  it('will block click event if disabled', () => {
    let fixture = {
      id: 'test',
      label: 'Test',
      name: 'submit',
      formId: 'form1',
      disabled: true
    };

    let dom = TestUtils.renderIntoDocument(<Action {...fixture}/>);
    let event = {
      stopPropagation() {}
    };
    spyOn(event, 'stopPropagation');
    dom.handleClick(event);
    expect(event.component).not.toBeDefined();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
