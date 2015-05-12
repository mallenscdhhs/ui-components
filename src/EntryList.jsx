'use-strict';
var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var _ = require('lodash');
var Immutable = require('immutable');
var Action = require('./Action');
var EntryListItem = require('./EntryListItem');
var Form = require('./Form');
var Grid = require('./Grid');
var Field = require('./Field');
var Factory = require('./Factory');
var elements = {
  form: Form,
  grid: Grid,
  field: Field
};

module.exports = React.createClass({
  displayName: 'EntryList',

  propTypes: {
    model: React.PropTypes.string,
    entries: React.PropTypes.arrayOf(React.PropTypes.object),
    formButtonText: React.PropTypes.string,
    emptyText: React.PropTypes.string,
    addButtonText: React.PropTypes.string,
    columns: React.PropTypes.arrayOf(React.PropTypes.object),
    form: React.PropTypes.object
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
      return entries ? config.set('entries', entries).toJSON() : config.toJSON();
    }
  },

  getDefaultProps: function(){
    return {
      model: '',
      entries: [],
      columns: [],
      form: {}
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
          'entry': {}
        });
        // fire FIELD_VALUE_CHANGE for the model
        var self = this;
        var entriesModel = {
          id: this.props.model,
          name: this.props.model,
          type: 'entrylist',
          value: this.state.entries
        };
        Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, entriesModel).then(function() {
          self.setState({showForm: false});
        });
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
      return <tr><td colSpan={this.props.columns.length}>{this.props.emptyText}</td></tr>;
    }
  },

  renderForm: function(showForm, model) {
    if(showForm) {
      return (
        <div className="entrylist-form">
          {Factory.build(elements, this.props.form, this.props.form)[0]}
          <div className="row text-right">
            <div className="col-md-12">
              <Action
                id="add-button"
                type="button"
                className="btn btn-default"
                name={this.props.formButtonText ? this.props.formButtonText : 'Add Entry'}
                event={constants.actions.ENTRYLIST_NEW_ENTRY_ADD} />
            </div>
          </div>
        </div>
      );
    }
  },

  /**
   * Render an EntryList component.
   * @returns {JSX}
   */
  render: function() {
    var columns = this.props.columns;

    return (
      <div className="entrylist mblg">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              {columns.map(function(col) {
                return <th key={col.dataKey}>{col.header}</th>;
              })}
              <th key="remove"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.map(function(entry, entryIdx) {
              return (
                <EntryListItem
                  entry={entry}
                  entryIdx={entryIdx}
                  columns={columns} />
              );
            })}
            {this.showEmptyText()}
          </tbody>
        </table>
        {this.renderForm(this.state.showForm, this.state.entry)}
        <Action
          id="add-entry-btn"
          type="button"
          iconClass="plus"
          className="btn btn-primary"
          name={this.props.addButtonText}
          event={constants.actions.ENTRYLIST_FORM_SHOW} />
      </div>
    );
  }

});
