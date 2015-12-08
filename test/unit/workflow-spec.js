import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Workflow from '../../src/Workflow';
import WorkflowItem from '../../src/WorkflowItem';
import Immutable from 'immutable';
let longerWorkflow = require('../fixtures/workflow-simple-more-pages.json');

describe('Workflow', function(){

  it('Renders a workflow', () => {
    let config = Immutable.fromJS(longerWorkflow.config).set('schema', longerWorkflow).toJS();
    let renderer = TestUtils.createRenderer();
    renderer.render(
      <Workflow {...config}>
        <WorkflowItem {...config.schema.components.page1.config} />
        <WorkflowItem {...config.schema.components.page2.config} />
      </Workflow>
    );
    let output = renderer.getRenderOutput();
    let title = output.props.children[0];
    expect(title.props.children).toBe(longerWorkflow.config.title);
    let tree = output.props.children[1];
    expect(tree.props.componentType).toBe('tree');
    let workflowItemChild = tree.props.children[0];
    expect(workflowItemChild.props.title).toBe(config.schema.components.page1.config.title);
  });

});
