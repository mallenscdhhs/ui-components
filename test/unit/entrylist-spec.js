import React from 'react';
import elements from '../../src/index';
import TestUtils from 'react-addons-test-utils';
import Immutable from 'immutable';
import Factory from '../../src/Factory';
import fixture from '../fixtures/entrylist.json';

const SCHEMA = fixture;
const mockEntry = {firstName: 'John', lastName: 'Doe', phone: '5554443210'};

function buildComponent(schema) {
  let componentBuild = Factory.build(elements, schema, schema)[0];
  let Component = componentBuild.type;
  let props = componentBuild.props;
  return TestUtils.renderIntoDocument(<Component {...props} schema={schema}/>);
}

describe('EntryList', () => {

  it('renders an entrylist', () => {
    let component = buildComponent(SCHEMA);
    let headers = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
    expect(component.props.columns.length).toBe(SCHEMA.config.columns.length);
    expect(headers.length).toBe(SCHEMA.config.columns.length + 1);
  });

  it('should render a configured form when "showForm" is set to "true"', () => {
    let _schema = Immutable.fromJS(SCHEMA).setIn(['config', 'showForm'], true).toJS();
    let componentWithForm = buildComponent(_schema);
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(componentWithForm, 'input');
    expect(inputs.length).toBe(3);
  });

  it('should add a new entry to the value list when adding a new entry', () => {
    let mockEvent = {};
    let component = buildComponent(SCHEMA);
    component.showForm(mockEvent);
    expect(mockEvent.component).toBeDefined();
    expect(mockEvent.component.id).toBe(SCHEMA.config.id);
    expect(mockEvent.component.schemaUpdates).toEqual({showForm: true, entryIndex: 0});
    expect(mockEvent.component.modelUpdates).toEqual({
      [SCHEMA.config.name]: [{firstName: '', lastName: '', phone: ''}]
    });
  });

  it('should facilitate editing of entries', () => {
    let schema = Immutable.fromJS(SCHEMA).setIn(['config', 'value'], [mockEntry]).toJS();
    let componentWithEntries = buildComponent(schema);
    let mockEvent = {
      target: {dataset: {index: 0}}
    };
    componentWithEntries.handleEdit(mockEvent);
    expect(mockEvent.component.id).toBe(schema.config.id);
    expect(mockEvent.component.schemaUpdates).toEqual({
      showForm: true,
      entryIndex: 0
    });

    let mockSaveEvent = {};
    componentWithEntries.saveEntry(mockSaveEvent);
    expect(mockSaveEvent.component.formId).toEqual(schema.child);
    expect(mockSaveEvent.component.schemaUpdates).toEqual({
      showForm: false,
      entryIndex: null
    });

    expect(mockSaveEvent.component.modelUpdates).toEqual({
      firstName: undefined,
      lastName: undefined,
      phone: undefined
    });
  });

  it('should send component data when input values change', () => {
    let schema = Immutable
      .fromJS(SCHEMA)
      .setIn(['config', 'showForm'], true)
      .setIn(['config', 'entryIndex'], 0)
      .setIn(['config', 'value'], [mockEntry])
      .toJS();

    let component = buildComponent(schema);
    let mockEvent = {
      component: {
        modelUpdates: {
          lastName: 'Foo'
        }
      }
    };

    let expectedModelUpdates = {
      [schema.config.name]: [{lastName: 'Foo', firstName: mockEntry.firstName, phone: mockEntry.phone}],
      lastName: 'Foo'
    };

    component.handleChange(mockEvent);
    expect(mockEvent.component.id).toEqual(schema.config.id);
    expect(mockEvent.component.modelUpdates).toEqual(expectedModelUpdates);
  });

  it('should empty all model values associated with entry on cancel', () => {
    let schema = Immutable
      .fromJS(SCHEMA)
      .setIn(['config', 'showForm'], true)
      .setIn(['config', 'entryIndex'], 0)
      .setIn(['config', 'value'], [mockEntry])
      .toJS();

    let component = buildComponent(schema);
    let mockEvent = {};
    let mockResult = {
      component: {
        id: schema.config.id,
        schemaUpdates: {
          showForm: false,
          entryIndex: null
        },
        modelUpdates: {
          [schema.config.name]: [],
          firstName: undefined,
          lastName: undefined,
          phone: undefined
        }
      }
    };

    component.cancelEdit(mockEvent);
    expect(mockEvent).toEqual(mockResult);
  });

  it('should be able to remove an entry from value list', () => {
    let schema = Immutable
      .fromJS(SCHEMA)
      .setIn(['config', 'value'], [mockEntry])
      .toJS();

    let component = buildComponent(schema);
    let mockEvent = {
      target: {dataset: {index: 0}}
    };

    let mockResult = {
      component: {
        id: schema.config.id,
        modelUpdates: {
          [schema.config.name]: []
        },
        schemaUpdates: {
          showForm: false,
          entryIndex: null
        }
      }
    };

    component.handleRemove(mockEvent);
    expect(mockEvent.component.schemaUpdates).toEqual(mockResult.component.schemaUpdates);
    expect(mockEvent.component.modelUpdates).toEqual(mockResult.component.modelUpdates);
  });

});
