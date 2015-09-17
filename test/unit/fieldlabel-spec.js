import React from 'react';
import FieldLabel from '../../src/FieldLabel';
import TestUtils from 'react/lib/ReactTestUtils';

let renderer = TestUtils.createRenderer();

describe('FieldLabel', () => {
  it('will render a label', () => {
    let fixture = {
      label: 'A label'
    };

    renderer.render(<FieldLabel {...fixture}/>);
    let output = renderer.getRenderOutput();
    expect(output.type).toEqual('span');
    expect(output.props.children[1]).toEqual(fixture.label);
  });

  it('will render required character', () => {
    let fixture = {
      label: 'A label',
      required: true
    };

    renderer.render(<FieldLabel {...fixture}/>);
    let output = renderer.getRenderOutput();
    let requiredChar = output.props.children[2];
    expect(output.type).toEqual('span');
    expect(output.props.children[1]).toEqual(fixture.label);
    expect(requiredChar.type).toEqual('span');
    expect(requiredChar.props.className).toEqual('required');
    expect(requiredChar.props.children).toEqual('*');
  });

  it('will render a description', () => {
    let fixture = {
      label: 'A label',
      description: 'A really long paragraph of text.'
    };

    renderer.render(<FieldLabel {...fixture}/>);
    let output = renderer.getRenderOutput();
    let desc = output.props.children[3];
    let text = desc.props.children.props.overlay.props.children;
    expect(desc.type).toEqual('span');
    expect(desc.props.className).toEqual('field-description');
    expect(text).toEqual(fixture.description);
  });
});
