'use-strict';
var React = require('react');
var EditorToggle = require('./EditorToggle');
var DependencyMixin = require('./DependencyMixin');
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

  getLabel: function(){
    var fieldSetLabel = null;
    if(this.props.name){
      fieldSetLabel = <legend className="field-label" key={this.props.name+"legend"}>{this.props.name}</legend>;
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
        {this.props.children}
      </fieldset>
    );
  }

});
