import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Page from '../../src/Page';
import Field from '../../src/Field';
import Immutable from 'immutable';
let layoutFixture = require('../fixtures/page-with-layout.json');

describe('Page component', function() {

  it('Renders a page', () => {
    let config = Immutable.fromJS(layoutFixture.config).set('schema', layoutFixture).toJS();
    let renderer = TestUtils.createRenderer();
    renderer.render(
      <Page {...config}>
        <Field {...config.schema.components.field_1.config} />
        <Field {...config.schema.components.field_2.config} />
      </Page>
    );
    let output = renderer.getRenderOutput();
    expect(output.type).toBe('article');
    let title = output.props.children[0];
    let content = output.props.children[1];
    let fields = output.props.children[2];
    let fieldOne = fields['.0'];
    let fieldTwo = fields['.1'];
    expect(title.type).toBe('header');
    expect(title.props.children.props.children).toBe(layoutFixture.config.title);
    expect(content.props.content).toBe(layoutFixture.config.content);
    expect(fieldOne.props.id).toBe(layoutFixture.components.field_1.config.id);
    expect(fieldOne.props.label).toBe(layoutFixture.components.field_1.config.label);
    expect(fieldTwo.props.id).toBe(layoutFixture.components.field_2.config.id);
    expect(fieldTwo.props.label).toBe(layoutFixture.components.field_2.config.label);
  });

});
