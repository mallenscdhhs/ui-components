'use-strict';
import React from 'react';
import Description from './Description';
import classnames from 'classnames';
import renderChildren from './render-children';

/**
 * Fieldset component
 * @module Fieldset
 */
class Fieldset extends React.Component {

  constructor(props) {
    super(props);
  }

  renderHelpText(){
    if(this.props.helpText){
      return <p key="help-block">{this.props.helpText}</p>;
    }
  }

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

  renderLabel(){
    if(this.props.name){
      return <legend className="field-label" key={`${this.props.name}Legend`}>{this.props.legend}{this.renderDescription()}</legend>;
    }
  }

  getClassNames(){
    return classnames({
      hidden: !this.props.visible
    });
  }

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render(){
    return (
      <fieldset key="fieldSetWithComponentsKey" id={this.props.id} className={this.getClassNames()}>
        {this.renderLabel()}
        {this.renderHelpText()}
        {renderChildren(this.props)}
      </fieldset>
    );
  }

};

Fieldset.propTypes = {
  title: React.PropTypes.string
};

Fieldset.defaultProps = {
  componentType: 'fieldset'
};

export default Fieldset;