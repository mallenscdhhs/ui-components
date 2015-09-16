import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import fixture from '../fixtures/fieldset.json';
import Immutable from 'immutable';
import Fieldset from '../../src/Fieldset';
import Field from '../../src/Field';

describe('Fieldset component', function() {

    it('renders a fieldset with children', () => {
        let config = Immutable.fromJS(fixture.config).set('schema', fixture).toJS();
        let renderer = TestUtils.createRenderer();
        renderer.render(
            <Fieldset {...config}>
                <Field {...config.schema.components.test_field.config} />
                <Field {...config.schema.components.test_field2.config} />
            </Fieldset>
        );
        let output = renderer.getRenderOutput();
        expect(output.type).toBe('fieldset');
        expect(output.props.id).toBe(fixture.config.id);
        let legend = output.props.children[0];
        expect(legend.props.children[0]).toBe(fixture.config.legend);
        let helpText = output.props.children[1];
        expect(helpText.props.children).toBe(fixture.config.helpText);
        let fields = output.props.children[2];
        let fieldOne = fields['.0'];
        expect(fieldOne.props.id).toBe(fixture.components.test_field.config.id);
        expect(fieldOne.props.label).toBe(fixture.components.test_field.config.label);
    });

    it('renders a fieldset that is hidden', () => {
        let config = Immutable.fromJS(fixture.config).set('schema', fixture).set('visible', false).toJS();
        let renderer = TestUtils.createRenderer();
        renderer.render(
          <Fieldset {...config}>
              <Field {...config.schema.components.test_field.config} />
              <Field {...config.schema.components.test_field2.config} />
          </Fieldset>
        );
        let output = renderer.getRenderOutput();
        expect(output.type).toBe('fieldset');
        expect(output.props.id).toBe(fixture.config.id);
        expect(output.props.className).toBe('hidden');
    });

});
