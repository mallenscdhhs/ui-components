'use-strict';
var React = require('react');
var Action = require('./Action');

module.exports = React.createClass({
  displayName: 'EntryListItem',

  propTypes: {
    entry: React.PropTypes.object,
    entryIdx: React.PropTypes.number,
    columns: React.PropTypes.array,
    actionConfig: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {
      entry: {},
      entryIdx: 0,
      columns: [],
      actionConfig: {}
    };
  },

  render: function(){
    var entry = this.props.entry;
    var entryIdx = this.props.entryIdx;

    return (
      <tr key={entry.dataKey}>
        {this.props.columns.map(function(col, colIdx) {
          var data = entry[col.dataKey];
          return <td key={col.dataKey}>{data}</td>;
        })}
        <td key={'remove-entry-'+entryIdx} className="entrylist-remove">
          <Action
            {...this.props.actionConfig}
            id={'remove-entry-'+entryIdx}
            removalId={entryIdx} />
        </td>
      </tr>
    );
  }
});
