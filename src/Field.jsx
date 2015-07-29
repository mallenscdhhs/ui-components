'use-strict';

import React from 'react';
import setClassNames from 'classnames';
import _ from 'lodash';
import Immutable from 'immutable';
import Flux from 'fluxify';
import constants from './constants';
import FieldLabel from './FieldLabel';
import HelpBlock from './HelpBlock';
import FieldGroup from './FieldGroup';
import ValidationMixin from './ValidationMixin';
import DependencyMixin from './DependencyMixin';
import Checkable from './Checkable';
import Select from './Select';
import Input from './Input';
import Textarea from './Textarea';
import DateComponent from './Date';
import AutoComplete from './AutoComplete';
import File from './File';
import ContentEditor from './ContentEditor';
import FieldValueMixin from './FieldValueMixin';
import utils from './utils.js';

/**
 * Field component
 * @module Field
 */
export default React.createClass ({

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
    disabled: React.PropTypes.bool,
    mask: React.PropTypes.string,
    forceManualInput: React.PropTypes.bool
  },

  statics: {
    /**
     * Provides configuration processing for Field components.
     * @param {Immutable.Map} schema - this components schema
     * @param {Immutable.Map} model - the data model(if any)
     * @param {Immutable.Map} components - the component list
     * @returns {JSON}
     */
    configure(schema, model, components) {
      let config = schema.get('config');
      let props = config.setIn(['className'], 'form-control');

      /**
       * Provides configuration for performing operations on a field dependent on previous
       * pages' field values.
       * @param {object} opConfig - Operation config must include an action and an actionType
       * along with any other relevant information needed to perform the operation
       * @param {object} action - The name of the operation to peform
       * @param {object} actionType - Define what kind of object should be returned from
       * the operation action
       */
      if (config.has('appInputOperationConfig')) {
        let opConfig = config.get('appInputOperationConfig');
        let action = opConfig.get('action');
        let actionType = opConfig.get('actionType');
        let updates = utils[action](props, model, opConfig);
        props = (updates && actionType === 'props') ? updates : props;
        model = (updates && actionType === 'model') ? updates : model;
      }

      if (model.has(props.get('id'))) {
        if(props.get('type') === 'checkbox') {
          // if model value is "true", then set "checked" to true
          if ( model.get(props.get('id')) === props.get('value') ) {
            props = props.set('checked', true);
          }
        } else {
          props = props.set('value', model.get(props.get('id')));
        }
      }
      return props.toJSON();
    }
  },

  getDefaultProps() {
    return {
      componentType: 'field',
      initialState: 'visible',
      disabled: false,
      mask: '',
      forceManualInput: false
    };
  },

  /**
   * Init Field state
   * @returns {object}
   */
  getInitialState() {
    return {
      hasError: false,
      errorMessage: ''
    };
  },

  /**
   * Returns whether or not the Field type is "radio" or "checkbox".
   * @returns {bool}
   */
  isRadioOrCheckbox() {
    return /radio|checkbox/.test(this.props.type);
  },

  /**
   * Boolean helper if type is radio or checkbox.  Used to determine if we
   * need to use special wrapper for those field types.
   * Check the type AND if there are available items to show.
   * @returns {object}
   */
  isFieldGroup() {
    let hasOptions = !!(this.props.options || this.props.optionsResource);
    return this.isRadioOrCheckbox() && hasOptions;
  },

  /**
   * Creates specified field type component.
   * @param {string} type
   * @returns {JSX}
   */
  getInputControl(type, isFieldGroup) {
    switch(type) {
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
      case 'file':
        return File;
      default:
        return Input;
    }
  },

  /**
   * Return the CSS class names to apply to the Field wrapper element.
   * @returns {object}
   */
  getClassNames() {
    return setClassNames({
      'form-group': true,
      'has-error': this.state.hasError,
      hidden: !this.state.visible
    });
  },

  /**
   * Render a Field component.
   * @returns {JSX}
   */
  render() {
    let fieldProps = (this.props.dependencyValue) ? (
      Immutable.fromJS(this.props).set('disabled',this.state.disabled ? 'disabled' : false).toJSON()
    ) : this.props;

    let isFieldGroup = this.isFieldGroup();
    let isRadioOrCheckbox = this.isRadioOrCheckbox();
    let wrapperTag = isFieldGroup ? 'fieldset' : 'div';
    let message = this.state.hasError ? this.state.errorMessage : this.props.helpText;
    let InputControl = this.getInputControl(this.props.type, isFieldGroup);
    let labelProps = _.pick(this.props, ['id', 'label', 'required', 'description', 'descriptionPlacement', 'descriptionTrigger']);
    let children = [];

    if ( isFieldGroup || !isRadioOrCheckbox ) {
      labelProps.isFieldGroup = isFieldGroup;
      children.push(<FieldLabel {...labelProps} key="field-label"/>);
    }

    children = children.concat([
      <InputControl {...fieldProps} key="input-control"/>,
      <HelpBlock {...fieldProps} key="help-block">{message}</HelpBlock>
    ]);

    return React.createElement(wrapperTag, {className: this.getClassNames()}, children);
  }

});
