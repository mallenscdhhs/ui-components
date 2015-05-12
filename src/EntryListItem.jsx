'use-strict';
var React = require('react');
var constants = require('./constants');
var Action = require('./Action');

module.exports = React.createClass({
  displayName: 'EntryListItem',

  propTypes: {
    entry: React.PropTypes.object,
    entryIdx: React.PropTypes.number,
    columns: React.PropTypes.array
  },

  getDefaultProps: function(){
    return {
      entry: {},
      entryIdx: 0,
      columns: []
    };
  },

  render: function(){
    var entry = this.props.entry;
    var entryIdx = this.props.entryIdx;
    var actionConfig = {
      name: 'remove',
      type: 'link',
      event: constants.actions.ENTRYLIST_ENTRY_REMOVE
    };

    return (
      <tr key={'entry-row-' + entryIdx}>
        {this.props.columns.map(function(col, colIdx) {
          var data = entry[col.dataKey];
          return <td key={col.dataKey + '-' + entryIdx}>{data}</td>;
        })}
        <td key={'remove-entry-' + entryIdx} className="entrylist-remove">
          <Action
            {...actionConfig}
            id={'remove-entry-' + entryIdx}
            removalId={entryIdx} />
        </td>
      </tr>
    );
  }
});
