import React from 'react';
import Factory from '../../src/Factory';
import Components from '../../src/main';
import EntryList from '../../src/EntryList';
import TestUtils from 'react/lib/ReactTestUtils';
import Immutable from 'immutable';
import Flux from 'fluxify';
import {dispatcher as Dispatcher } from 'fluxify';
import fixture from '../fixtures/entrylist.json';

const API_URI = '/api/rules';

// setup the rules endpoint for testing
Components.configure({API: {validation: API_URI}});

let schema = Immutable.fromJS(fixture.components.myEntryList);
let model = Immutable.Map(fixture.model);
let renderer = TestUtils.createRenderer();
let {
  APPLICATION_VALIDATE_ENTRY,
  ENTRYLIST_NEW_ENTRY_VALIDATED,
  ENTRYLIST_ENTRY_REMOVE,
  ENTRYLIST_ENTRY_EDIT,
  ENTRYLIST_NEW_ENTRY_ADD,
  FIELD_VALUE_CHANGE,
  FIELD_VALIDATION_ERROR,
  ENTRYLIST_FORM_SHOW
} = Components.constants.actions;

function createEntryListWithoutRules() {
  let config = fixture.components.myEntryList.config;
  let configWithEntries = EntryList.configure(schema, model);
  let component = <EntryList {...configWithEntries}/>;
  renderer.render(component);
  let renderedComponent = renderer.getRenderOutput();
  let entrylist = TestUtils.renderIntoDocument(component);
  return {entrylist, renderedComponent};
}

describe('EntryList', () => {
  beforeEach(() => jasmine.Ajax.install());
  afterEach(() => jasmine.Ajax.uninstall());

  it('renders an entrylist', () => {
    let {renderedComponent} = createEntryListWithoutRules();
    let entries = renderedComponent.props.children[0].props.children;
    expect(entries.length).toEqual(fixture.model.medicaidNumbers.length);
  });

  it('can facilitate removal of entries', (done) => {
    let {entrylist} = createEntryListWithoutRules();
    let removeFirstEntry = TestUtils.scryRenderedDOMComponentsWithTag(entrylist, 'a')[1];
    let handler = Dispatcher.register((action, data) => {
      if (action === ENTRYLIST_ENTRY_REMOVE) {
        Dispatcher.unregister(handler);
        expect(entrylist.state.entries.length).toEqual(fixture.model.medicaidNumbers.length - 1);
        done();
      }
    });

    expect(entrylist.state.entries.length).toEqual(fixture.model.medicaidNumbers.length);
    TestUtils.Simulate.click(removeFirstEntry);
  });

  it('can facilitate editing of entries', (done) => {
    let {entrylist} = createEntryListWithoutRules();
    let editFirstEntry = TestUtils.scryRenderedDOMComponentsWithTag(entrylist, 'a')[0];
    let testValue = 'test-value';
    let editHandler = Dispatcher.register((action, data) => {
      if (action === ENTRYLIST_ENTRY_EDIT) {
        let firstInput = TestUtils.scryRenderedDOMComponentsWithTag(entrylist, 'input')[0];
        let updateEntry = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-default');

        // accept user input
        TestUtils.Simulate.change(firstInput.getDOMNode(), {target: {value: testValue}});

        // click Update button to update the entry
        TestUtils.Simulate.click(updateEntry);
      }
    });

    let updateHandler = Dispatcher.register((action, data) => {
      if (action === ENTRYLIST_NEW_ENTRY_ADD) {
        Dispatcher.unregister(updateHandler);
        expect(entrylist.state.entry.medicaidNumber).toEqual(testValue);
        done();
      }
    });

    // click Edit link on the first entry and update it
    TestUtils.Simulate.click(editFirstEntry);
  });

  it('can facilitate adding new entries', (done) => {
    let {entrylist} = createEntryListWithoutRules();
    let newEntry = {
      medicaidNumber: '0509584',
      npi: '0987654325',
      enrollmentDate: '01/01/2015',
      state: 'GA'
    };
    let addNewEntryBtn = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-primary');
    let addHandler = Dispatcher.register((action, data) => {
      if (action === ENTRYLIST_FORM_SHOW) {
        Dispatcher.unregister(addHandler);
        let addEntry = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-default');
        expect(entrylist.state.entries.length).toEqual(fixture.model.medicaidNumbers.length);
        entrylist.setState({entry: newEntry});

        // click button to add the entry
        TestUtils.Simulate.click(addEntry.getDOMNode());
      }
    });

    let saveHandler = Dispatcher.register((action, data) => {
      if (action === FIELD_VALUE_CHANGE) {
        Dispatcher.unregister(saveHandler);
        let comp = fixture.components.myEntryList;
        expect(data.id).toBe(comp.config.model);
        expect(data.name).toBe(comp.config.model);
        expect(data.type).toBe('entrylist');
        expect(data.value.length).toBe(3);
        expect(data.latestEntry.medicaidNumber).toBe(newEntry.medicaidNumber);
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(API_URI)
      .andReturn({
        responseText: '{"operationStatus": "SUCCESS"}'
      });

    // click Add New Entry button to show new entry form
    TestUtils.Simulate.click(addNewEntryBtn);
  });

  it('can validate entries', (done) => {
    let {entrylist} = createEntryListWithoutRules();
    let newEntry = {
      medicaidNumber: '000348992',
      npi: '',
      enrollmentDate: '05/01/2015',
      state: 'SC'
    };
    let addNewEntryBtn = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-primary');
    let addHandler = Dispatcher.register((action, data) => {
      if (action === ENTRYLIST_FORM_SHOW) {
        Dispatcher.unregister(addHandler);
        let addEntry = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-default');
        entrylist.setState({entry: newEntry});
        TestUtils.Simulate.click(addEntry.getDOMNode());
      }
    });

    let errorHandler = Dispatcher.register((action, data) => {
      console.log(action, data);
      if (action === FIELD_VALIDATION_ERROR && data.name === 'npi') {
        Dispatcher.unregister(errorHandler);
        console.log(data);
        expect(data.hasError).toBe(true);
        done();
      }
    });

    jasmine.Ajax
      .stubRequest(API_URI)
      .andReturn({
        responseText: JSON.stringify({
          operationStatus: 'FAILURE',
          operationMessages: [
            {
              metadata: {
                rule: 'required',
                params: ['npi']
              },
              description: 'Field is not valid.'
            }
          ]
        })
      });

    // click Add New Entry button to show new entry form
    TestUtils.Simulate.click(addNewEntryBtn);
  });
});
