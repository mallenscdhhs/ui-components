'use-strict';
import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import _ from 'lodash';
import Immutable from 'immutable';
import Action from './Action';
import EntryListItem from './EntryListItem';
import EntryListForm from './EntryListForm';
import EntryListBtn from './EntryListBtn';
import DependencyMixin from './DependencyMixin';
import setClassNames from 'classnames';
let {
  ENTRYLIST_FORM_SHOW,
  ENTRYLIST_ENTRY_CANCEL,
  ENTRYLIST_ENTRY_EDIT,
  ENTRYLIST_ENTRY_REMOVE,
  ENTRYLIST_FIELD_VALUE_CHANGE,
  ENTRYLIST_NEW_ENTRY_ADD,
  APPLICATION_VALIDATE_ENTRY,
  ENTRYLIST_NEW_ENTRY_VALIDATED,
  FIELD_VALUE_CHANGE
} = constants.actions;

export default React.createClass({

  displayName: 'EntryList',

  mixins: [DependencyMixin],

  statics: {
    configure: function(schema, model, components) {
      let config = schema.get('config');
      let entries = model.get(config.get('model'));
      return entries ? config.set('entries', entries).toJSON() : config.toJSON();
    }
  },

  propTypes: {
    model: React.PropTypes.string,
    entries: React.PropTypes.arrayOf(React.PropTypes.object),
    emptyText: React.PropTypes.string,
    addNewButtonText: React.PropTypes.string,
    columns: React.PropTypes.arrayOf(React.PropTypes.object),
    form: React.PropTypes.object,
    formAddButtonText: React.PropTypes.string,
    formUpdateButtonText: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      model: '',
      entries: [],
      addNewButtonText: 'Add New',
      CancelButtonText: 'Cancel',
      columns: [],
      form: {},
      formAddButtonText: 'Add Entry',
      formUpdateButtonText: 'Update Entry'
    };
  },

  getInitialState() {
    return {
      entries: [],
      entry: {},
      showForm: false,
      formConfig: {},
      isEdit: false
    };
  },

  componentWillMount() {
    this.setState({entries: this.props.entries});
  },

  componentDidMount() {
    let propsId = this.props.id;
    // when the user clicks the show form button
    Dispatcher.register(`show-entrylist-form-${propsId}`, (action, data) => {
      if(action === ENTRYLIST_FORM_SHOW && data.id === this.props.id) {
        this.setState({showForm: true});
      }
    });

    // when the user clicks the cancel button
    Dispatcher.register(`cancel-entrylist-entry-${propsId}`, (action, data) => {
      if(action === ENTRYLIST_ENTRY_CANCEL && data.id === this.props.id) {
        this.setState({
          isEdit: false,
          showForm: false,
          entry: {}
        });
      }
    });

    // when the user clicks the edit entry link
    Dispatcher.register(`edit-entrylist-entry-${propsId}`, (action, data) => {
      if(action === ENTRYLIST_ENTRY_EDIT && data.id === this.props.id) {
        let currentEntry = Immutable.Map(this.state.entries[data.entryId]);
        let formConfig = Immutable.fromJS(this.props.form).set('model', currentEntry).toJSON();
        this.setState({
          isEdit: true,
          entry: currentEntry.set('_id', data.entryId).toJSON(),
          formConfig: formConfig,
          showForm: true
        });
      }
    });

    // when the user clicks the remove entry link
    Dispatcher.register(`remove-entrylist-entry-${propsId}`, (action, data) => {
      if(action === ENTRYLIST_ENTRY_REMOVE && data.id === this.props.id) {
        let entries = Immutable.List(this.state.entries);
        this.setState({ entries: entries.remove(data.entryId).toJSON() });
      }
    });

    // when the user fills out the add entry form
    Dispatcher.register(`entrylist-field-value-change-${propsId}`, (action, data) => {
      if(action === ENTRYLIST_FIELD_VALUE_CHANGE && data.entryListId === this.props.id) {
        let value = data.dateString ? data.dateString : data.value;
        let updatedEntry = Immutable.Map(this.state.entry).set(data.name, value).toJSON();
        this.setState({entry: updatedEntry});
      }
    });

    // when the user clicks the #add-entry-btn
    Dispatcher.register(`add-new-entrylist-entry-${propsId}`, (action, data) => {
      if(action === ENTRYLIST_NEW_ENTRY_ADD && data.id === this.props.id) {
        let currentEntries = Immutable.List(this.state.entries);
        let updatedEntries = (!this.state.isEdit) ?
          currentEntries.push(this.state.entry) :
          currentEntries.set(this.state.entry._id, this.state.entry);
        let entries = updatedEntries.toJSON();
        // fire FIELD_VALUE_CHANGE for the model
        let entriesModel = {
          id: this.props.model,
          name: this.props.model,
          type: 'entrylist',
          value: entries,
          latestEntry: this.state.entry,
          entryListId: this.props.id
        };
        Flux.doAction(APPLICATION_VALIDATE_ENTRY, this.props.form, entriesModel);
      }
    });

    Dispatcher.register(`add-new-entrylist-entry-validated-${propsId}`, (action, entriesModel) => {
      if(action === ENTRYLIST_NEW_ENTRY_VALIDATED && entriesModel.entryListId === this.props.id) {
        Flux.doAction(FIELD_VALUE_CHANGE, entriesModel).then(() => {
          _.defer(() => {
            this.setState({isEdit: false, entry: {}, entries: entriesModel.value, showForm: false});
          });
        });
      }
    });
  },

  componentWillUnmount() {
    let propsId = this.props.id;
    Dispatcher.unregister(`show-entrylist-form-${propsId}`);
    Dispatcher.unregister(`cancel-entrylist-entry-${propsId}`);
    Dispatcher.unregister(`edit-entrylist-entry-${propsId}`);
    Dispatcher.unregister(`remove-entrylist-entry-${propsId}`);
    Dispatcher.unregister(`entrylist-field-value-change-${propsId}`);
    Dispatcher.unregister(`add-new-entrylist-entry-${propsId}`);
    Dispatcher.unregister(`add-new-entrylist-entry-validated-${propsId}`);
  },

  showEmptyText() {
    if (!this.state.entries.length) {
      return <tr><td colSpan={this.props.columns.length + 2}>{this.props.emptyText}</td></tr>;
    }
  },

  getClassNames() {
    return setClassNames({
      entrylist: true,
      mblg: true,
      hidden: !this.state.visible
    });
  },

  /**
   * Render an EntryList component.
   * @returns {JSX}
   */
  render() {
    let columns = this.props.columns;
    let formConfig = this.state.isEdit ? this.state.formConfig : this.props.form;
    let actionName = this.state.isEdit ? this.props.formUpdateButtonText : this.props.formAddButtonText;
    return (
      <div className={this.getClassNames()}>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              {columns.map(function(col) {
                return <th key={col.dataKey}>{col.header}</th>;
              })}
              <th key="actions" colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.map((entry, entryIdx) => {
              return (
                <EntryListItem
                  id={this.props.id}
                  key={`entrylist-item-${entryIdx}-${this.props.id}`}
                  entry={entry}
                  entryIdx={entryIdx}
                  columns={columns} />
              );
            })}
            {this.showEmptyText()}
          </tbody>
        </table>
        <EntryListForm
          entryListId={this.props.id}
          show={this.state.showForm}
          config={formConfig}
          actionName={actionName}
          key={`${this.props.form.config.id}-${this.props.id}`} />
        <EntryListBtn
          id={this.props.id}
          key={`${this.props.id}-entrylist-form-show`}
          iconClass="plus"
          show={this.state.showForm}
          name={this.props.addNewButtonText}
          event={ENTRYLIST_FORM_SHOW} />
        <EntryListBtn
          id={this.props.id}
          key={`${this.props.id}-entrylist-entry-cancel`}
          show={!this.state.showForm}
          name={this.props.CancelButtonText}
          event={ENTRYLIST_ENTRY_CANCEL} />
      </div>
    );
  }
});
