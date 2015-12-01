import React from 'react';
import Field from '../../src/Field';
import Date from '../../src/Date';
import TestUtils from 'react/lib/ReactTestUtils';
import fixture from '../fixtures/field-date.json';

describe('Date input', function() {

  it('Renders date picker', () => {
    let renderer = TestUtils.createRenderer();
    renderer.render(<Field {...fixture}/>);
    let dateComponent = renderer.getRenderOutput();
    expect(dateComponent.props.type).toBe(fixture.type);
    expect(dateComponent.props.name).toBe(fixture.name);
    expect(dateComponent.props.value).toBe(fixture.value);
  });

  it('can handle change event', (done) => {
    let handleSimulatedChange = (e) => {
      expect(e.component).toBeDefined();
      expect(e.component.id).toEqual(fixture.id);
      expect(e.component.modelUpdates).toBeDefined();
      expect(e.component.modelUpdates[fixture.name]).toEqual(fixture.value);
      done();
    };

    let component = TestUtils.renderIntoDocument(<Date {...fixture}/>);
    // set change listener on parent component root element
    let _compRoot = React.findDOMNode(component);
    _compRoot.addEventListener('change', handleSimulatedChange);
    // initiate react-widgets DateTimePicker onChange event, in turn triggers simulated change event
    component.handleDateChange('2015-09-30T05:00:00.000Z', '09/30/2015');
  });

});
