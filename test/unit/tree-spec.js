import React from 'react';
import Tree from '../../src/Tree';
import TestUtils from 'react-addons-test-utils';

describe('Tree component', function(){
  it('will render if passed children', () => {
    let renderer = TestUtils.createRenderer();
    renderer.render(<Tree><li>test</li></Tree>);
    let output = renderer.getRenderOutput();
    let first = output.props.children;
    expect(output.type).toBe('ul');
    expect(output.props.className).toBe('nav nav-tree');
    expect(first.type).toBe('li');
    expect(first.props.children).toBe('test');
  });
});
