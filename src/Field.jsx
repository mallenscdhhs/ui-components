'use-strict';

var React = require('react');
var setClassNames = require('classnames');
var _ = require('lodash');
var Flux = require('fluxify');
var constants = require('./constants');
var EditorToggle = require('./EditorToggle');
var FieldLabel = require('./FieldLabel');
var HelpBlock = require('./HelpBlock');
var FieldGroup = require('./FieldGroup');
var ValidationMixin = require('./ValidationMixin');
var DependencyMixin = require('./DependencyMixin');
var Checkable = require('./Checkable');
var Select = require('./Select');
var Input = require('./Input');
var Textarea = require('./Textarea');
var DateComponent = require('./Date');
var AutoComplete = require('./AutoComplete');
var ContentEditor = require('./ContentEditor');
var FieldValueMixin = require('./FieldValueMixin');

module.exports = React.createClass({

  displayName: 'Field',

  mixins: [ValidationMixin, DependencyMixin, FieldValueMixin],

  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    required: React.PropTypes.bool,
    helpText: React.PropTypes.string,
    visible: React.PropTypes.string,
    persistInSession: React.PropTypes.bool,
    disabled: React.PropTypes.bool
  },

  getDefaultProps: function(){
    return {
      componentType: 'field',
      initialState: 'visible',
      disabled: false
    };
  },

  /**
   * Init Field state, including if the field is viewable based on a dependency
   * @returns {object}
   */
  getInitialState: function() {
    return {
      visible: this.props.initialState !== 'hidden',
      hasError: false,
      errorMessage: ''
    };
  },

  /**
   * Returns whether or not the Field type is "radio" or "checkbox".
   * @returns {bool}
   */
  isRadioOrCheckbox: function(){
    return /radio|checkbox/.test(this.props.type);
  },

  /**
   * Boolean helper if type is radio or checkbox.  Used to determine if we
   * need to use special wrapper for those field types.
   * Check the type AND if there are available items to show.
   * @returns {object}
   */
  isFieldGroup: function () {
    var hasOptions = !!(this.props.options || this.props.optionsResource);
    return this.isRadioOrCheckbox() && hasOptions;
  },

  /**
   * Creates specified field type component.
   * @param {string} type
   * @returns {JSX}
   */
  getInputControl : function(type, isFieldGroup){
    switch(type){
      case 'contenteditor':
        return ContentEditor;
      case 'textarea':
        return Textarea;
      case 'radio':
      case 'checkbox':
        return isFieldGroup? FieldGroup : Checkable;
      case 'select':
        return Select;
      case 'autocomplete':
        return AutoComplete;
      case 'date':
        return DateComponent;
      default:
        return Input;
    }
  },

  /**
   * Return the CSS class names to apply to the Field wrapper element.
   * @returns {object}
   */
  getClassNames: function(){
    return setClassNames({
      'form-group': true,
      'editable-component': true,
      'has-error': this.state.hasError,
      'hidden': !this.state.visible
    });
  },

  /**
   * Render a Field component.
   * @returns {JSX}
   */
  render: function(){
    var isFieldGroup = this.isFieldGroup();
    var isRadioOrCheckbox = this.isRadioOrCheckbox();
    var wrapperTag = isFieldGroup? 'fieldset' : 'div';
    var message = this.state.hasError? this.state.errorMessage : this.props.helpText;
    var InputControl = this.getInputControl(this.props.type, isFieldGroup);
    var labelProps = _.pick(this.props, ['id', 'label', 'required','description','descriptionPlacement','descriptionTrigger']);
    var children = [];

    if ( isFieldGroup || !isRadioOrCheckbox ) {
      labelProps.isFieldGroup = isFieldGroup;
      children.push(<FieldLabel {...labelProps} key="field-label"/>);
    }

    children = children.concat([
      <EditorToggle {...this.props} key="editor-toggle"/>,
      <InputControl {...this.props} key="input-control"/>,
      <HelpBlock {...this.props} key="help-block">{message}</HelpBlock>
    ]);

    return React.createElement(wrapperTag, {className: this.getClassNames()}, children);
  }

});
