import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

describe('Form component', () => {

  it('Renders a form', () => {
    let shallowRenderer = TestUtils.createRenderer();
    let Form = React.createElement('form', {type: 'form', id: 'test_form', name: 'Test Form'});
    shallowRenderer.render(Form);
    let comp = shallowRenderer.getRenderOutput();
    expect(comp.type).toEqual('form');
    expect(comp.props.id).toEqual('test_form');
  });

});
