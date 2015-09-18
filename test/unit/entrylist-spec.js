import React from 'react';
import EntryList from '../../src/EntryList';
import Form from '../../src/Form';
import Field from '../../src/Field';
import TestUtils from 'react/lib/ReactTestUtils';
import Immutable from 'immutable';
import fixture from '../fixtures/entrylist.json';

describe('EntryList', () => {
  let config = Immutable.fromJS(fixture.config).set('schema', fixture).toJS();
  let comp = TestUtils.renderIntoDocument(
    <EntryList {...config}>
      <Form {...config.schema.components.elForm.config}>
        <Field {...config.schema.components.elField1.config}/>
        <Field {...config.schema.components.elField2.config}/>
        <Field {...config.schema.components.elField3.config}/>
      </Form>
    </EntryList>
  );
  let dom = React.findDOMNode(comp);
  let entrylist = TestUtils.findRenderedDOMComponentWithClass(comp, 'entrylist');
  let table = React.findDOMNode(entrylist).childNodes[0];
  let columns = table.childNodes[0].childNodes[0].childNodes;

  // simulate schema/model updates and re-rendering of the entrylist component
  let applyUpdates = (e) => {
    let component = Immutable.fromJS(e.component);
    if (component.has('schemaUpdates')) {
      component.get('schemaUpdates').forEach((value, key) => comp.props[key] = value);
    }
    if (component.has('modelUpdates')) {
      comp.props.value = e.component.modelUpdates.value;
    }
    // rerender the component
    comp.setState();
  };

  // simulate running through the steps of clicking edit, opening the form, and changing a field value
  let runEditFlow = (e, lastSavedEntry) => {
    comp.handleEdit(e);
    applyUpdates(e);
    // allow re-render to finish
    setTimeout(() => {
      let formBtns = TestUtils.scryRenderedDOMComponentsWithTag(entrylist, 'button');
      let saveBtn = formBtns[0];
      let cancelBtn = formBtns[1];
      // show form with save and cancel buttons and cache previous entrylist value
      expect(saveBtn).toBeDefined();
      expect(cancelBtn).toBeDefined();
      expect(e.component.schemaUpdates.showForm).toEqual(true);
      expect(comp.state.previousValue).toEqual([{firstName: 'John', middleName: 'Sonnyboy', lastName: 'Doe'}]);
    }, 300);

    // change firstName value
    comp.setState({previousValue: lastSavedEntry});
    e = {target: {value: [{firstName: 'Joe', middleName: 'Sonnyboy', lastName: 'Doe'}]}};
    e.component = {modelUpdates: {}};
    comp.handleChange(e);
    applyUpdates(e);
    expect(e.component.modelUpdates.value).toEqual(e.target.value);
  };

  it('renders an entrylist', () => {
    expect(entrylist).toBeDefined();
    expect(table.className).toEqual('table table-striped table-bordered table-hover');
    // extra column is for actions
    expect(columns.length).toEqual(config.columns.length + 1);
    // entrylist is empty by default, form is hidden, and Add New Entry button is present
    let addNewEntryBtn = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-primary');
    expect(comp.props.value.length).toEqual(0);
    expect(addNewEntryBtn).toBeDefined();
    expect(comp.props.showForm).toEqual(false);
  });

  it('can facilitate adding new entries', () => {
    // click Add New Entry button to show new entry form
    let e = {nativeEvent: {type: 'click'}};
    comp.showForm(e);
    expect(e.component).toBeDefined();
    expect(e.component.schemaUpdates.showForm).toEqual(true);
    expect(e.component.schemaUpdates.entryIndex).toEqual(0);
    expect(e.component.modelUpdates.id).toEqual(config.name);
    expect(e.component.modelUpdates.value).toEqual([{firstName: '', middleName: '', lastName: ''}]);
    applyUpdates(e);
    // allow re-render to finish
    setTimeout(() => {
      // entrylist form is showing, add/submit entry is present
      let entrylistForm = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'entrylist-form');
      let addEntry = TestUtils.findRenderedDOMComponentWithClass(entrylist, 'btn-default');
      expect(entrylistForm).toBeDefined();
      expect(addEntry).toBeDefined();
    }, 300);

    // click Add button to submit new entry
    e = {target: {value: [{firstName: 'John', middleName: 'Sonnyboy', lastName: 'Doe'}]}};
    e.component = {modelUpdates: {}};
    comp.handleChange(e);
    applyUpdates(e);
    expect(e.component.modelUpdates.id).toEqual(config.name);
    expect(e.component.modelUpdates.value).toEqual(e.target.value);
    expect(comp.props.value.length).toEqual(1);
  });

  it('can facilitate editing of entries', () => {
    // click edit button to edit entry
    let e = {nativeEvent: {type: 'click'}, target: {dataset: {index: 0}}};
    let lastSavedEntry = [{firstName: 'John', middleName: 'Sonnyboy', lastName: 'Doe'}];
    runEditFlow(e, lastSavedEntry);

    // clicking save button, hides form and clears entryIdx
    e = {nativeEvent: {type: 'click'}, target: {dataset: {index: 0}}};
    comp.saveEntry(e);
    applyUpdates(e);
    expect(e.component.schemaUpdates.showForm).toEqual(false);
    expect(e.component.schemaUpdates.entryIndex).toEqual(null);
  });

  it('can cancel entry while editing', () => {
    // click edit button to edit entry
    let e = {nativeEvent: {type: 'click'}, target: {dataset: {index: 0}}};
    let lastSavedEntry = [{firstName: 'John', middleName: 'Sonnyboy', lastName: 'Doe'}];
    runEditFlow(e, lastSavedEntry);

    // clicking cancel button, reverts to last saved entry, hides form, and clears entryIdx
    e = {nativeEvent: {type: 'click'}};
    comp.cancelEdit(e);
    applyUpdates(e);
    expect(e.component.modelUpdates.value).toEqual(lastSavedEntry);
    expect(e.component.schemaUpdates.showForm).toEqual(false);
    expect(e.component.schemaUpdates.entryIndex).toEqual(null);
  });

  it('can facilitate removal of entries', () => {
    // click remove button to remove entry
    let e = {nativeEvent: {type: 'click'}, target: {dataset: {index: 0}}};
    comp.handleRemove(e);
    applyUpdates(e);

    // hide form and clear entryIdx
    expect(e.component.schemaUpdates.showForm).toEqual(false);
    expect(e.component.schemaUpdates.entryIndex).toEqual(null);
    expect(comp.props.value.length).toEqual(0);
  });
});
