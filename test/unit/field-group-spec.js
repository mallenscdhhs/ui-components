import React from 'react';
import FieldGroup from '../../src/FieldGroup';
import TestUtils from 'react/lib/ReactTestUtils';
import Field from '../../src/Field';

let options = [
  {label: 'Foo', value: 'foo'},
  {label: 'Bar', value: 'bar'},
  {label: 'Baz', value: 'baz'}
];

describe('FieldGroup', () => {
  it('can render a group of checkboxes/radios', () => {
    let fixture = {
      id: 'test',
      name: 'testing',
      type: 'checkbox',
      label: 'Testing',
      options
    };

    let component = TestUtils.renderIntoDocument(<FieldGroup {...fixture}/>);
    let dom = React.findDOMNode(component);
    let _legend = dom.childNodes[0];
    let fieldGroup = dom.childNodes[1];
    expect(dom.tagName).toEqual('FIELDSET');
    expect(_legend.childNodes[0].textContent).toEqual(fixture.label);
    expect(fieldGroup.className).toEqual('field-group');
    expect(fieldGroup.childNodes.length).toEqual(fixture.options.length);
    let firstField = fieldGroup.childNodes[0];
    let firstLabel = firstField.childNodes[0].childNodes[0];
    let firstInput = firstLabel.childNodes[0];
    let firstLabelText = firstLabel.childNodes[1].textContent;
    let firstFieldId = `${fixture.id}-option-${fixture.options[0].value}`;
    expect(firstInput.getAttribute('name')).toEqual(fixture.name);
    expect(firstInput.getAttribute('type')).toEqual(fixture.type);
    expect(firstInput.getAttribute('id')).toEqual(firstFieldId);
    expect(firstLabel.getAttribute('for')).toEqual(firstFieldId);
    expect(firstLabelText).toEqual(fixture.options[0].label);
  });

  it('can handle checkbox change events', (done) => {
    let fixture = {
      type: 'checkbox',
      id: 'test',
      name: 'testbox',
      label: 'Do you compute?',
      value: ['bar'],
      options
    };

    let handler = (event) => {
      expect(event.target.value).toBe('baz');
      expect(event.component).toBeDefined();
      expect(event.component.id).toEqual(fixture.id);
      expect(event.component.schemaUpdates).toBeDefined();
      expect(event.component.schemaUpdates.checked).toBeUndefined();
      expect(event.component.modelUpdates).toBeDefined();
      expect(event.component.modelUpdates.value.join('-')).toEqual('bar-baz');
      expect(event.component.modelUpdates.id).toEqual(fixture.name);
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <div onChange={handler}>
        <Field {...fixture}/>
      </div>
    );

    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    let input = inputs[2];
    TestUtils.Simulate.change(input, {
      target: {
        value: React.findDOMNode(input).value,
        checked: true
      }
    });
  });

  it('can handle radio change events', (done) => {
    let fixture = {
      type: 'radio',
      id: 'test',
      name: 'testbox',
      label: 'Do you compute?',
      options: [
        {label: 'Yes', value: 'yes'},
        {label: 'No', value: 'no'}
      ]
    };

    let handler = (event) => {
      expect(event.target.value).toBe('no');
      expect(event.component).toBeDefined();
      expect(event.component.id).toEqual(fixture.id);
      expect(event.component.schemaUpdates).toBeDefined();
      expect(event.component.schemaUpdates.checked).toBe(true);
      expect(event.component.modelUpdates).toBeDefined();
      expect(event.component.modelUpdates.value).toEqual('no');
      expect(event.component.modelUpdates.id).toEqual(fixture.name);
      done();
    };

    let component = TestUtils.renderIntoDocument(
      <div onChange={handler}>
        <Field {...fixture}/>
      </div>
    );

    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    let input = inputs[1];
    TestUtils.Simulate.change(input, {
      target: {
        value: React.findDOMNode(input).value,
        checked: true
      }
    });
  });

  describe('#isOptionChecked', () => {
    it('can determine checked state', () => {
      let result = FieldGroup.isOptionChecked({value: ['bar', 'baz']}, 'bar');
      expect(result).toBe(true);
      result = FieldGroup.isOptionChecked({value: 'bar'}, 'bar');
      expect(result).toBe(true);
    });
  });
});
