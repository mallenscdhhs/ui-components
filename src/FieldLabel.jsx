'use-strict';
import React from 'react';
import {Popover, OverlayTrigger, Glyphicon} from 'react-bootstrap';

/**
 * Determines whether to render a <label> or <legend> based on the
 * isFieldGroup property.
 * @module FieldLabel
 */
class FieldLabel extends React.Component {

  renderDescription() {
    if (this.props.description) {
      let popover = <Popover title={this.props.descriptionTitle}>{this.props.description}</Popover>;
      return (
        <span className="field-description">
          <OverlayTrigger
            trigger={this.descriptionTrigger}
            placement={this.descriptionPlacement}
            overlay={popover}>
              <Glyphicon glyph="info-sign" aria-hidden="true"/>
          </OverlayTrigger>
        </span>
      );
    }
  }

  renderRequiredIndicator() {
    if (!!this.props.required) {
      return <span className="required">*</span>;
    }
  }

  render() {
    return (
      <span>
        {this.props.children}
        {this.props.label}
        {this.renderRequiredIndicator()}
        {this.renderDescription()}
      </span>
    );
  }
}

FieldLabel.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  required: React.PropTypes.bool,
  isFieldGroup: React.PropTypes.bool,
  description: React.PropTypes.string,
  descriptionTitle: React.PropTypes.string,
  descriptionTrigger: React.PropTypes.string,
  descriptionPlacement: React.PropTypes.string
};

FieldLabel.defaultProps = {
  isFieldGroup: false,
  desriptionTrigger: ['hover', 'focus'],
  descriptionPlacement: 'top'
};

export default FieldLabel;
