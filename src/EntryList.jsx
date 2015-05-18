'use-strict';
import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from './constants';
import _ from 'lodash';
import Immutable from 'immutable';
import Action from './Action';
import EntryListItem from './EntryListItem';
import Form from './Form';
import Grid from './Grid';
import Field from './Field';
import Factory from './Factory';

let elements = {
  form: Form,
  grid: Grid,
  field: Field
};

class EntryList extends React.Component {

  /**
   * Provides configuration processing for Field components.
   * @param {Immutable.Map} schema - this components schema
   * @param {Immutable.Map} [model] - the data model(if any)
   * @param {Immutable.Map} components - the component list
   * @returns {JSON}
   */
  static configure(schema, model, components) {
    let config = schema.get('config');
    let entries = model.get(config.get('model'));
    return entries ? config.set('entries', entries).toJSON() : config.toJSON();
  }

  constructor() {
    super();
    this.state = {
      entries: [],
      entry: {},
      showForm: false,
      formConfig: {},
      isEdit: false
    };
    this.showEmptyText = this.showEmptyText.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentWillMount() {
    this.setState({entries: this.props.entries});
  }

  componentDidMount() {
    // when the user clicks the show form button
    Dispatcher.register('show-entrylist-form', function(action){
      if ( action === constants.actions.ENTRYLIST_FORM_SHOW ) {
        this.setState({showForm: true});
      }
    }.bind(this));

    // when the user clicks the edit entry link
    Dispatcher.register('edit-entrylist-entry', function(action, data){
      if ( action === constants.actions.ENTRYLIST_ENTRY_EDIT ) {
        let currEntry = this.state.entries[data.entryId];
        let paired = _.pairs(currEntry);
        let formConfig = _.cloneDeep(this.props.form);
        // update the formConfig with currEntry values
        _.forEach(paired, function(item) {
          let path = 'components.' + item[0] + '.config.value';
          _.set(formConfig, path, item[1]);
        });
        this.setState({
          isEdit: true,
          entry: currEntry,
          formConfig: formConfig,
          showForm: true
        });
      }
    }.bind(this));

    // when the user clicks the remove entry link
    Dispatcher.register('remove-entrylist-entry', function(action, data){
      if ( action === constants.actions.ENTRYLIST_ENTRY_REMOVE ) {
        let entries = Immutable.List(this.state.entries);
        this.setState({ entries: entries.remove(data.entryId).toJSON() });
      }
    }.bind(this));

    // when the user fills out the add entry form
    Dispatcher.register('entrylist-field-value-change', function(action, data) {
      if ( action === 'entrylist-field-value-change-action' ) {
        let value = data.dateString ? data.dateString : data.value;
        this.setState({ entry: _.merge(this.state.entry, _.zipObject([data.name], [value])) });
      }
    }.bind(this));

    // when the user clicks the #add-entry-btn
    Dispatcher.register('add-new-entrylist-entry', function(action){
      if ( action === constants.actions.ENTRYLIST_NEW_ENTRY_ADD ) {
        if (!this.state.isEdit) {
          this.setState({
            entries: this.state.entries.concat(this.state.entry)
          });
        }
        // fire FIELD_VALUE_CHANGE for the model
        let self = this;
        let entriesModel = {
          id: this.props.model,
          name: this.props.model,
          type: 'entrylist',
          value: this.state.entries
        };
        Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, entriesModel).then(function() {
          self.setState({isEdit: false, entry: {}, showForm: false});
        });
      }
    }.bind(this));
  }

  componentWillUnmount() {
    Dispatcher.unregister('show-entrylist-form');
    Dispatcher.unregister('edit-entrylist-entry');
    Dispatcher.unregister('remove-entrylist-entry');
    Dispatcher.unregister('entrylist-field-value-change');
    Dispatcher.unregister('add-new-entrylist-entry');
  }

  showEmptyText() {
    if (!this.state.entries.length) {
      return <tr><td colSpan={this.props.columns.length}>{this.props.emptyText}</td></tr>;
    }
  }

  renderForm(showForm, formConfig, isEdit) {
    var config = isEdit ? formConfig : this.props.form;
    if(showForm) {
      return (
        <div className="entrylist-form">
          {Factory.build(elements, config, config)[0]}
          <div className="row text-right">
            <div className="col-md-12">
              <Action
                id="add-button"
                type="button"
                className="btn btn-default"
                name={isEdit ? this.props.formUpdateButtonText : this.props.formAddButtonText}
                event={constants.actions.ENTRYLIST_NEW_ENTRY_ADD} />
            </div>
          </div>
        </div>
      );
    }
  }

  /**
   * Render an EntryList component.
   * @returns {JSX}
   */
  render() {
    var columns = this.props.columns;
    return (
      <div className="entrylist mblg">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              {columns.map(function(col) {
                return <th key={col.dataKey}>{col.header}</th>;
              })}
              <th key="edit"></th>
              <th key="remove"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.map(function(entry, entryIdx) {
              return (
                <EntryListItem
                  key={'entrylist-item-'+entryIdx}
                  entry={entry}
                  entryIdx={entryIdx}
                  columns={columns} />
              );
            })}
            {this.showEmptyText()}
          </tbody>
        </table>
        {this.renderForm(this.state.showForm, this.state.formConfig, this.state.isEdit)}
        <Action
          id="add-entry-btn"
          type="button"
          iconClass="plus"
          className="btn btn-primary"
          name={this.props.addNewButtonText}
          event={constants.actions.ENTRYLIST_FORM_SHOW} />
      </div>
    );
  }
}

EntryList.propTypes = {
  model: React.PropTypes.string,
  entries: React.PropTypes.arrayOf(React.PropTypes.object),
  emptyText: React.PropTypes.string,
  addNewButtonText: React.PropTypes.string,
  columns: React.PropTypes.arrayOf(React.PropTypes.object),
  form: React.PropTypes.object,
  formAddButtonText: React.PropTypes.string,
  formUpdateButtonText: React.PropTypes.string
};

EntryList.defaultProps = {
  model: '',
  entries: [],
  columns: [],
  form: {},
  formAddButtonText: 'Add Entry',
  formUpdateButtonText: 'Update Entry'
};

export default EntryList;
