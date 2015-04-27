var React = require("react");
var setClassNames = require('classnames');
var Popover = require("react-bootstrap").Popover;
var OverlayTrigger = require("react-bootstrap").OverlayTrigger;

/**
 * Create Description popup for a field
 * @module Description
 */
module.exports = React.createClass({

  displayName: 'Description',

  getPopover: function(){
    return <Popover title={this.props.label}>{this.props.description}</Popover>;
  },

  getClassNames: function(){
    return setClassNames({
      'glyphicon': true,
      'glyphicon-info-sign': true,
      'hide': !this.props.description
    });
  },

  render: function(){
    return (<span>
              <OverlayTrigger trigger='hover' placement='top' overlay={this.getPopover()}>
                <span className={this.getClassNames()} aria-hidden="true"></span>
              </OverlayTrigger>
            </span>);
  }
});
