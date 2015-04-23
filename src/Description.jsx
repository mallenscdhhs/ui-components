var React = require("react");
var Popover = require("react-bootstrap").Popover;
var OverlayTrigger = require("react-bootstrap").OverlayTrigger;

/**
 * Create Description popup for a field
 * @module Description
 */
module.exports = React.createClass({

  displayName: 'Description',

  getPopover: function(){
    return <Popover title='Popover left'>{this.props.name}</Popover>;
  },

  render: function(){
    return (<div>
              <OverlayTrigger trigger='click' placement='left' overlay={this.getPopover()}>
                <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
              </OverlayTrigger>
            </div>);
  }
});
