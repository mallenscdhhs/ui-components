'use-strict';
var React = require('react');
var Flux = require('fluxify');
var Dispatcher = Flux.dispatcher;
var constants = require('./constants');
var _ = require('lodash');
var Immutable = require('immutable');
var Action = require('./Action');
var Field = require('./Field');

module.exports = React.createClass({
  displayName: 'EntryList',

  propTypes: {
    type: React.PropTypes.string.isRequired,
    config: React.PropTypes.shape({
      model: React.PropTypes.string,
      form: React.PropTypes.shape({
        fields: React.PropTypes.array.isRequired
      }),
      formButtonText: React.PropTypes.string,
      emptyText: React.PropTypes.string,
      addButtonText: React.PropTypes.string,
      columns: React.PropTypes.array.isRequired
    })
  },

  getDefaultProps: function(){
    return {
      type: 'entrylist',
      config: {
        model: '',
        form: {
          fields: []
        },
        columns: []
      }
    };
  },

  getInitialState: function(){
    return {
      entries: [],
      entry: {},
      showForm: false
    };
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
  },

  componentWillUnmount: function(){
    Dispatcher.unregister('show-entrylist-form');
    Dispatcher.unregister('remove-entrylist-entry');
  },

  showEmptyText: function() {
    if (!this.state.entries.length) {
      return <tr><td colSpan="5">{this.props.config.emptyText}</td></tr>;
    }
  },

  renderForm: function(showForm, model) {
    // when the user fills out the add entry form
    Dispatcher.register('entrylist-field-value-change-action', function(action, data) {
      if ( action === constants.actions.FIELD_VALUE_CHANGE_ACTION ) {
        var value = data.dateString ? data.dateString : data.value;
        this.setState({ 'entry': _.merge(this.state.entry, _.zipObject([data.name], [value])) });
      }
    }.bind(this));

    // when the user clicks the #add-entry-btn
    Dispatcher.register('add-new-entrylist-entry', function(action){
      if ( action === constants.actions.ENTRYLIST_NEW_ENTRY_ADD ) {
        Dispatcher.unregister('entrylist-field-value-change-action');
        Dispatcher.unregister('add-new-entrylist-entry');
        this.setState({
          'entries': this.state.entries.concat(this.state.entry),
          'entry': {},
          'showForm': false
        });
        // fire FIELD_VALUE_CHANGE for the model
        Flux.doAction(constants.actions.FIELD_VALUE_CHANGE, this.state.entries);
      }
    }.bind(this));

    return (
      <tr className={showForm ? '' : 'hide'}>
        <td colSpan="5">
          <form id="entrylist-form" name="entrylist-form" className="mamd">
            <div className="row">
              {this.props.config.form.fields.map(function(field) {
                return (
                  <div key={field.id} className="col-md-6">
                    <Field
                      {...field}
                      className="form-control"
                      fieldValueChangeAction={true} />
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
                  name={this.props.config.form.formButtonText ? this.props.form.formButtonText : 'Add Entry'}
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
    var columns = this.props.config.columns;
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
                <tr key={entry.dataKey}>
                  {columns.map(function(col, colIdx) {
                    var data = entry[col.dataKey];
                    return <td key={col.dataKey}>{data}</td>;
                  })}
                  <td key={'remove-entry-'+entryIdx} className="entrylist-table-remove">
                    <Action
                      {...rowActionConfig}
                      id={'remove-entry-'+entryIdx}
                      removalId={entryIdx} />
                  </td>
                </tr>
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
