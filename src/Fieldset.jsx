'use-strict';
var React = require('react');
var EditorToggle = require('./EditorToggle');
var DependencyMixin = require('./DependencyMixin');
var Description = require('./Description');
var HelpBlock = require('./HelpBlock');
var setClassNames = require('classnames');

/**
 * Fieldset component
 * @module Fieldset
 */
module.exports = React.createClass({

  displayName: 'Fieldset',

  mixins: [DependencyMixin],

  getDefaultProps: function(){
    return {
      componentType: 'fieldset'
    };
  },

  getHelpText: function(){
    var helpText;
    if(this.props.helpText){
      helpText = <p>{this.props.helpText}</p>;
    }
    return helpText;
  },

  getDescription: function(){
    var description;
    if(this.props.description){
      description = <Description key="description-text" {...this.props} />;
    }
    return description;
  },

  getLabel: function(){
    var fieldSetLabel = null;
    if(this.props.name){
      fieldSetLabel = <legend className="field-label" key={this.props.name+"Legend"}>{this.props.legend}{this.getDescription()}</legend>;
    }
    return fieldSetLabel;
  },

  getClassNames: function(){
    return setClassNames({
      'editable-component' : true,
      'hidden': !this.state.visible
    });
  },

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    return (
      <fieldset key="fieldSetWithComponentsKey" id={this.props.id} className={this.getClassNames()}>
        <EditorToggle {...this.props}/>
        {this.getLabel()}
        {this.getHelpText()}
        {this.props.children}
      </fieldset>
    );
  }

});
