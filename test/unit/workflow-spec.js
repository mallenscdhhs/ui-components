import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Workflow from '../../src/Workflow';
import Immutable from 'immutable';
let longerWorkflow = require('../fixtures/workflow-simple-more-pages.json');

describe('Workflow', function(){

  it('Renders a workflow', () => {
    let renderer = TestUtils.createRenderer();
    renderer.render(<Workflow {...longerWorkflow.config} />);
    let output = renderer.getRenderOutput();
    let title = output.props.children[0];
    expect(title.props.children).toBe(longerWorkflow.config.title);
  });

});
