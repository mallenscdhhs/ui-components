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

  propTypes: {
    description: React.PropTypes.string.isRequired,
    descriptionTrigger: React.PropTypes.string,
    descriptionPlacement: React.PropTypes.string
  },

  getTrigger: function(){
    return this.props.descriptionTrigger ? this.props.descriptionTrigger : 'hover';
  },

  getPlacement: function(){
    return this.props.descriptionPlacement ? this.props.descriptionPlacement : 'top';
  },

  getPopover: function(){
    return <Popover title={this.props.descriptionTitle}>{this.props.description}</Popover>;
  },

  getClassNames: function(){
    return setClassNames({
      'glyphicon': true,
      'glyphicon-info-sign': true
    });
  },

  render: function(){
    return (
      <span className="field-description">
        <OverlayTrigger trigger={this.getTrigger()} placement={this.getPlacement()} overlay={this.getPopover()}>
          <span className={this.getClassNames()} aria-hidden="true"></span>
        </OverlayTrigger>
      </span>
    );
  }
});
