import React from 'react';
import Field from '../../src/Field';
import DateField from '../../src/Date';
import TestUtils from 'react-addons-test-utils';
import fixture from '../fixtures/field-date.json';
import DateInput from 'react-widgets/lib/DateInput';

describe('Date input', function() {

  it('Renders date picker', () => {
    let renderer = TestUtils.createRenderer();
    renderer.render(<Field {...fixture}/>);
    let dateComponent = renderer.getRenderOutput();
    expect(dateComponent.props.type).toBe(fixture.type);
    expect(dateComponent.props.name).toBe(fixture.name);
    expect(dateComponent.props.value).toBe(fixture.value);
  });

  it('can parse date value', () => {
    let result = DateField.getDateValue('09/24/1981');
    expect(result.getFullYear()).toBe(1981);
    expect(result.getMonth()).toBe(8);
    expect(result.getDate()).toBe(24);
  });

  it('can parse "today" string as a Date', () => {
    let today = new Date();
    let result = DateField.getDateValue('today');
    expect(result.getFullYear()).toBe(today.getFullYear());
    expect(result.getMonth()).toBe(today.getMonth());
    expect(result.getDate()).toBe(today.getDate());
  });

  it('should return "null" if no value is configured', () => {
    let result = DateField.getDateValue(undefined);
    expect(result).toBeNull();
  });

  it('can parse date strings', () => {
    let result = DateField.parseDate('09241981');
    expect(result.getFullYear()).toBe(1981);
    expect(result.getMonth()).toBe(8);
    expect(result.getDate()).toBe(24);
  });

});
