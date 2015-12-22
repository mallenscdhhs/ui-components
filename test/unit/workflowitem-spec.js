import React from 'react';
import TestUtils from 'react-addons-test-utils';
import WorkflowItem from '../../src/WorkflowItem';
import Immutable from 'immutable';
let longerWorkflow = require('../fixtures/workflow-simple-more-pages.json');

describe('WorkflowItem', function(){

    it('Renders an active workflowitem', () => {
        let renderer = TestUtils.createRenderer();
        let config = Immutable.fromJS(longerWorkflow.components.page1.config)
            .set('schema',longerWorkflow)
            .toJS();
        renderer.render(<WorkflowItem {...config} />);
        let output = renderer.getRenderOutput();
        let title = output.props.children[0];
        expect(output.type).toBe('li');
        expect(output.props.className).toBe('');
        expect(title.props.children).toBe(longerWorkflow.components.page1.config.title);
    });

    it('Renders an inactive workflowitem', () => {
        let renderer = TestUtils.createRenderer();
        let config = Immutable.fromJS(longerWorkflow.components.page1.config)
            .set('schema', longerWorkflow)
            .set('active', false)
            .toJS();
        renderer.render(<WorkflowItem {...config} />);
        let output = renderer.getRenderOutput();
        let title = output.props.children[0];
        expect(output.type).toBe('li');
        expect(output.props.className).toBe('inactive');
        expect(title.props.children).toBe(longerWorkflow.components.page1.config.title);
    });

    it('Renders a disabled workflowitem', () => {
        let renderer = TestUtils.createRenderer();
        let config = Immutable.fromJS(longerWorkflow.components.page1.config)
            .set('schema', longerWorkflow)
            .set('disabled', true)
            .toJS();
        renderer.render(<WorkflowItem {...config} />);
        let output = renderer.getRenderOutput();
        let title = output.props.children[0];
        expect(output.type).toBe('li');
        expect(output.props.className).toBe('disabled');
        expect(title.props.children).toBe(longerWorkflow.components.page1.config.title);
    });

    it('Renders a current workflowitem', () => {
        let renderer = TestUtils.createRenderer();
        let config = Immutable.fromJS(longerWorkflow.components.page1.config)
            .set('schema', longerWorkflow)
            .set('current', true)
            .toJS();
        renderer.render(<WorkflowItem {...config} />);
        let output = renderer.getRenderOutput();
        let title = output.props.children[0];
        expect(output.type).toBe('li');
        expect(output.props.className).toBe('current');
        expect(title.props.children).toBe(longerWorkflow.components.page1.config.title);
    });

});
