'use-strict';
var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var _ = require('lodash');
var Immutable = require('immutable');
var Action = require('./Action');
var Field = require('./Field');
var EntryListItem = require('./EntryListItem');

module.exports = React.createClass({
  displayName: 'EntryList',

  propTypes: {
    model: React.PropTypes.string,
    entries: React.PropTypes.arrayOf(React.PropTypes.object),
    form: React.PropTypes.shape({
      fields: React.PropTypes.array.isRequired
    }),
    formButtonText: React.PropTypes.string,
    emptyText: React.PropTypes.string,
    addButtonText: React.PropTypes.string,
    columns: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  statics: {
    /**
     * Provides configuration processing for Field components.
     * @param {Immutable.Map} schema - this components schema
     * @param {Immutable.Map} [model] - the data model(if any)
     * @param {Immutable.Map} components - the component list
     * @returns {JSON}
     */
    configure: function(schema, model, components){
      var config = schema.get('config');
      var entries = model.get(config.get('model'));
      return model ? config.set('entries', entries).toJSON() : config.toJSON();
    }
  },

  getDefaultProps: function(){
    return {
      model: '',
      entries: [],
      form: {
        fields: []
      },
      columns: []
    };
  },

  getInitialState: function(){
    return {
      entries: [],
      entry: {},
      showForm: false
    };
  },

  componentWillMount: function() {
    this.setState({entries: this.props.entries});
  },

  componentDidMount: function() {
    // when the user clicks the show form button
    Dispatcher.register('show-entrylist-form', function(action){
      if ( action === constants.actions.ENTRYLIST_FORM_SHOW ) {
        this.setState({'showForm': true});
      }
    }.bind(this));

    // when the user clicks the remove entry btn
    Dispatcher.register('remove-entrylist-entry', function(action, data){
      if ( action === constants.actions.ENTRYLIST_ENTRY_REMOVE ) {
        var entries = Immutable.List(this.state.entries);
        this.setState({ 'entries': entries.remove(data.removalId).toJSON() });
      }
    }.bind(this));

    // when the user fills out the add entry form
    Dispatcher.register('entrylist-field-value-change', function(action, data) {
      if ( action === 'entrylist-field-value-change-action' ) {
        var value = data.dateString ? data.dateString : data.value;
        this.setState({ 'entry': _.merge(this.state.entry, _.zipObject([data.name], [value])) });
      }
    }.bind(this));

    // when the user clicks the #add-entry-btn
    Dispatcher.register('add-new-entrylist-entry', function(action){
      if ( action === constants.actions.ENTRYLIST_NEW_ENTRY_ADD ) {
        this.setState({
          'entries': this.state.entries.concat(this.state.entry),
          'entry': {},
          'showForm': false
        });
        // fire FIELD_VALUE_CHANGE for the model
        var entriesModel = {
          id: this.props.model,
          name: 'entrylistModel',
          type: 'entrylist',
          value: this.state.entries
        };
        Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, entriesModel);
      }
    }.bind(this));
  },

  componentWillUnmount: function(){
    Dispatcher.unregister('show-entrylist-form');
    Dispatcher.unregister('remove-entrylist-entry');
    Dispatcher.unregister('entrylist-field-value-change');
    Dispatcher.unregister('add-new-entrylist-entry');
  },

  showEmptyText: function() {
    if (!this.state.entries.length) {
      return <tr><td colSpan="5">{this.props.emptyText}</td></tr>;
    }
  },

  renderForm: function(showForm, model) {
    return (
      <tr className={showForm ? '' : 'hide'}>
        <td colSpan="5">
          <form id="entrylist-form" name="entrylist-form" className="mamd">
            <div className="row">
              {this.props.form.fields.map(function(field) {
                return (
                  <div key={field.id} className="col-md-6">
                    <Field
                      {...field}
                      className="form-control"
                      fieldValueChangeAction="entrylist-field-value-change-action" />
                  </div>
                );
              })}
            </div>
            <div className="row text-right">
              <div className="col-md-12">
                <Action
                  id="add-button"
                  type="button"
                  className="btn btn-default"
                  name={this.props.form.formButtonText ? this.props.form.formButtonText : 'Add Entry'}
                  event={constants.actions.ENTRYLIST_NEW_ENTRY_ADD} />
              </div>
            </div>
          </form>
        </td>
      </tr>
    );
  },

  /**
   * Render an EntryList component.
   * @returns {JSX}
   */
  render: function() {
    var columns = this.props.columns;
    var rowActionConfig = {
      name: 'remove',
      type: 'link',
      event: constants.actions.ENTRYLIST_ENTRY_REMOVE
    };

    return (
      <div className="mblg">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              {columns.map(function(col) {
                return <th key={col.dataKey}>{col.header}</th>;
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.map(function(entry, entryIdx) {
              return (
                <EntryListItem
                  entry={entry}
                  entryIdx={entryIdx}
                  columns={columns}
                  actionConfig={rowActionConfig} />
              );
            })}
            {this.showEmptyText()}
            {this.renderForm(this.state.showForm, this.state.entry)}
          </tbody>
        </table>
        <Action
          id="add-entry-btn"
          type="button"
          iconClass="plus"
          className="btn btn-primary"
          name="Add Medicaid Number"
          event={constants.actions.ENTRYLIST_FORM_SHOW} />
      </div>
    );
  }

});
