import React from 'react';
import Field from '../../src/Field'
import TestUtils from 'react/lib/ReactTestUtils';
import fixture from '../fixtures/field-date.json';

describe('Date input', function() {

  it('Renders date picker', () => {
    let renderer = TestUtils.createRenderer();
    renderer.render(
      <Field {...fixture}/>
    );
    let output = renderer.getRenderOutput();
    let dateComponent = output;
    expect(dateComponent.props.type).toBe(fixture.type);
    expect(dateComponent.props.name).toBe(fixture.name);
    expect(dateComponent.props.value).toBe(fixture.value);
  });

  it('can handle change event', (done) => {

    let handler = (event) => {
      expect(event.component).toBeDefined();
      expect(event.component.id).toEqual(fixture.id);
      expect(event.component.modelUpdates).toBeDefined();
      expect(event.component.modelUpdates.value).toEqual('11/02/2008');
      expect(event.component.modelUpdates.id).toEqual(fixture.name);
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <div onChange={handler}>
        <Field {...fixture}/>
      </div>
    );

    let event = {target: {value: '11/02/2008'}};
    let node = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
    TestUtils.Simulate.change(node, event);

  });

});
