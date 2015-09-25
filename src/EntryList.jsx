'use-strict';
import React from 'react';
import _ from 'lodash';
import setClassNames from 'classnames';
import renderChildren from './render-children';
import {Button, Glyphicon} from 'react-bootstrap';

class EntryList extends React.Component {

  constructor(){
    super();
    this.state = {
      previousValue: []
    };
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showForm = this.showForm.bind(this);
    this.saveEntry = this.saveEntry.bind(this);
    this.updateEntries = this.updateEntries.bind(this);
  }

  updateEntries(property, entries, value) {
    let _entries = _.slice(entries, 0);
    let index = this.props.entryIndex;
    let entry = _entries[index];
    if (entry) {
      entry[property] = value;
    }
    _entries.splice(index, 1, entry);
    return _entries;
  }

  handleEdit(e) {
    let entryIndex = Number(e.target.dataset.index);
    this.setState({previousValue: this.props.value});
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        showForm: true,
        entryIndex
      }
    };
  }

  handleRemove(e) {
    let value = _.slice(this.props.value, 0);
    let entryIndex = e.target.dataset.index;
    value.splice(entryIndex, 1);
    e.component = {
      id: this.props.id,
      modelUpdates: {
        id: this.props.name,
        value
      },
      schemaUpdates: {
        showForm: false,
        entryIndex: null
      }
    };
  }

  handleChange(e) {
    let updatedEntries = this.updateEntries(e.target.name, this.props.value, e.component.modelUpdates.value);
    e.component = {
      id: this.props.id,
      modelUpdates: {
        id: this.props.name,
        value: updatedEntries
      }
    };
  }

  cancelEdit(e) {
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        showForm: false,
        entryIndex: null
      },
      modelUpdates: {
        id: this.props.name,
        value: this.state.previousValue
      }
    };
  }

  showForm(e) {
    let value = _.slice(this.props.value, 0);
    let newEntry = _.reduce(this.props.columns, (entry, col) => {
      entry[col.dataKey] = '';
      return entry;
    }, {});
    value.push(newEntry);
    let entryIndex = value.length -1;
    this.setState({previousValue: this.props.value});
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        showForm: true,
        entryIndex
      },
      modelUpdates: {
        id: this.props.name,
        value
      }
    };
  }

  saveEntry(e) {
    e.component = {
      id: this.props.id,
      schemaUpdates: {
        showForm: false,
        entryIndex: null,
        isAddingNewEntry: false
      }
    };
  }

  renderForm() {
    let html = (
      <div>
        <Button bsStyle="primary" onClick={this.showForm}>
          <Glyphicon glyph="plus"/> Add
        </Button>
      </div>
    );
    if (this.props.showForm) {
      html = (
        <div className="entrylist-form" onChange={this.handleChange}>
          {renderChildren(this.props)}
          <div className="row text-right">
            <div className="col-md-12">
              <Button bsStyle="primary" onClick={this.saveEntry}>Save</Button>
              <Button onClick={this.cancelEdit}>Cancel</Button>
            </div>
          </div>
        </div>
      );
    }
    return html;
  }

  renderEmptyText() {
    if (!this.props.value.length) {
      return <tr><td colSpan={this.props.columns.length + 2}>{this.props.emptyText}</td></tr>;
    }
  }

  render() {
    let classNames = setClassNames({
      entrylist: true,
      mblg: true,
      hidden: !this.props.visible
    });

    return (
      <div className={classNames}>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              {this.props.columns.map(col => <th key={col.dataKey}>{col.header}</th>)}
              <th key="actions" colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.value.map((entry, i) => {
              return (
                <tr key={`entry-row-${i}`}>
                  {this.props.columns.map((col, colIdx) => {
                    let data = entry[col.dataKey];
                    return <td key={`${col.dataKey}-${i}`}>{data}</td>;
                  })}
                  <td key={`edit-entry-${i}`} className="entrylist-edit">
                    <a onClick={this.handleEdit} data-index={i} href="javascript:void(0);">edit</a>
                  </td>
                  <td key={`remove-entry-${i}`} className="entrylist-remove">
                    <a onClick={this.handleRemove} data-index={i} href="javascript:void(0);">remove</a>
                  </td>
                </tr>
              );
            })}
            {this.renderEmptyText()}
          </tbody>
        </table>
        {this.renderForm()}
      </div>
    );
  }
}

EntryList.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.arrayOf(React.PropTypes.object),
  emptyText: React.PropTypes.string,
  columns: React.PropTypes.arrayOf(React.PropTypes.object),
  showForm: React.PropTypes.bool,
  entryIndex: React.PropTypes.number
};

EntryList.defaultProps = {
  value: [],
  showForm: false,
  entryIndex: null,
  columns: [],
  emptyText: 'Please add an item to the list.'
};

export default EntryList;
