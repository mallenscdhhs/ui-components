'use-strict';
import React from 'react';
import constants from './constants';
import Action from './Action';

class EntryListItem extends React.Component {

  render() {
    let entry = this.props.entry;
    let entryIdx = this.props.entryIdx;
    let editActionConfig = {
      id: this.props.id,
      name: 'edit',
      type: 'link',
      event: constants.actions.ENTRYLIST_ENTRY_EDIT
    };
    let removeActionConfig = {
      id: this.props.id,
      name: 'remove',
      type: 'link',
      event: constants.actions.ENTRYLIST_ENTRY_REMOVE
    };

    return (
      <tr key={'entry-row-' + entryIdx}>
        {this.props.columns.map(function(col, colIdx) {
          let data = entry[col.dataKey];
          return <td key={col.dataKey + '-' + entryIdx}>{data}</td>;
        })}
        <td key={'edit-entry-' + entryIdx} className="entrylist-edit">
          <Action
            {...editActionConfig}
            key={'edit-entry-' + entryIdx + '-' + this.props.id}
            entryId={entryIdx} />
        </td>
        <td key={'remove-entry-' + entryIdx} className="entrylist-remove">
          <Action
            {...removeActionConfig}
            key={'remove-entry-' + entryIdx + '-' + this.props.id}
            entryId={entryIdx} />
        </td>
      </tr>
    );
  }
}

EntryListItem.propTypes = {
  entry: React.PropTypes.object,
  entryIdx: React.PropTypes.number,
  columns: React.PropTypes.array
};

EntryListItem.defaultProps = {
  entry: {},
  entryIdx: 0,
  columns: []
};

export default EntryListItem;
