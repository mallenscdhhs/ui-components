var React = require('react/addons');
var _ = require('underscore');
var Queue = require('./EventQueue');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Field',

  mixins: [EditorMixin],

  /**
   * Upon mounting, subscribe to any dependency that the field has, an monitor the field
   * for events that would require you to make a state change.
   * @returns {void}
   */
  componentDidMount: function(){
    var component = this;

    // Listen for changes to other fields that I'm dependent on
    if(this.hasDependency()){      
      var initState = component.props.dependency.initialState === 'hidden' ? false : true;
      var depName = component.props.dependency.name;
      var depValues = component.props.dependency.value.split('|'); // Array of 'actionable' values
      Queue.subscribe('field:blur:'+depName,'field:'+component.props.name,function(data){
        // Verify field is correct and new value is in the 'actionable' array
        if(data.fieldName === depName && depValues.indexOf(data.fieldValue) >= 0){ 
          // Change from initial display state.
          component.setState({display: !initState}); 
        }else{
          // Otherwise, revert to (or stay at) initState
          component.setState({display: initState})
        }
      });
    }

    // Listen for validation errors from application
    Queue.subscribe('field:error:'+component.props.name,'field:'+component.props.name,function(data){
      // Change from initial display state.
      component.setState({'hasError': data.hasError,'errorMessage':data.errorMessage}); 
    });

    // If component uses options, subscribe to options event
    if(this.props.type === 'select' || this.props.type === 'multiselect') {
      Queue.subscribe( 'field:options:'+component.props.name , 'field:'+component.props.name , function(data){
        component.setState({'options': data});
      });
      // Ask for select options
      Queue.push({'entityEvent': 'field:mount:' + this.props.name, 'data' : {'id': this.props.id , 'fieldName' : this.props.name }});
    }

  },

  /**
   * UnSubscribe from any dependent field events that the current field was listening to.
   * @returns {void}
   */
  componentWillUnmount: function(){
    if(this.hasDependency()){
      var depName = this.props.dependency.name;
      Queue.unSubscribe('field:blur:'+depName,'field:'+this.props.name);
    }

    Queue.unSubscribe('field:error:'+this.props.name,'field:'+this.props.name);

    //If component uses options, unsubscribe to options events
    if(this.props.type === 'select' || this.props.type === 'multiselect') {
      Queue.unSubscribe('field:options:'+component.props.name,'field:'+component.props.name);
    }
  },

  /**
   * Check if the field has a dependency, which requires name, value and initialState to be set
   * @returns {boolean}
   */
  hasDependency: function(){
    return !!this.props.dependency;
  },

  /**
   * Return Field's Value
   * @returns {*}
   */
  getValue: function(){
    return this.state.value;
  },

  /**
   * Init Field state, including if the field is viewable based on a dependency
   * @returns {object}
   */
  getInitialState: function() {
    var viewableState = true; // default is 'visible'
    if(this.hasDependency() && this.props.dependency.initialState && this.props.dependency.initialState ==='hidden'){
      viewableState = false;
    }
    return { 'value' : this.props.value, 'display' : viewableState, 'hasError' : false , 'errorMessage' : '' , 'options' : this.props.options };
  },

  /**
   * Event handler for onBlur, that pushes a message to the queue, with the field's name and value.
   * @returns {void}
   */
  handleBlur: function(){
    Queue.push({'entityEvent':'field:blur:'+this.props.name,'data':{'id': this.props.id,'fieldName':this.props.name,'fieldValue':this.state.value,'rules':this.props.rules}});
  },

  /**
   * Event handler for onChange, that updates the field's state with the new value
   * @returns {void}
   */
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },  

  /**
   * Based on display state, return group of classes for the form group container
   * @returns {object}
   */
  getRenderViewClasses: function(){
    var fieldClasses = {
      'form-group' : true,
      'editable-component' : true,
      'hidden' : !this.state.display,
      'has-error' : this.state.hasError
    }
    if(this.props.classes){
      _.each(this.props.classes,function(cla,i){
        fieldClasses[cla] =  true;
      });
    }
    return fieldClasses;
  },  

  /**
   * Boolean helper if type is radio or checkbox.  Used to determine if we 
   * need to use special wrapper for those field types.
   * Check the type AND if there are available items to show.
   * @returns {object}
   */
  isFieldGroup: function () {
    var checkType = this.props.type === 'radio' || this.props.type === 'checkbox';
    var checkItems = this.props.options && this.props.options.items && this.props.options.items.length;
    return checkType && checkItems;
  },

  /**
   * Build Checkbox or Radio template based on type.
   * @returns {JSX template}
   */
  getCheckboxOrRadio : function(){
    var fieldName = this.props.name;
    var fieldType = (this.props.type).toLowerCase();
    var fieldKey = 'option';
    var labelKey = fieldType + 'Label'  
    var helpKey = 'field'+this.props.name+'HelpText';
    var field = this;
    var fields = this.props.options.items.map(function(item, i){
      fieldKey = fieldType + 'Option' + i;
      labelKey = fieldType + 'Label' + i;
      var isChecked = item.value === field.state.value;
      return (<label key={labelKey}><input type={fieldType} value={item.value} checked={isChecked} className="field" id={fieldName} name={fieldName}  ref={fieldName}  key={fieldKey} aria-describedby={helpKey} onChange={this.handleChange} onBlur={this.handleBlur}/>{item.label}</label>);
    });
    return fields;
  },

  /**
   * Build list of select options
   * @returns {JSX template}
   */
  getSelectOptions: function(){
    var options = null;
    if(this.state.options && this.state.options.items){
      options = this.state.options.items.map(function(item, i){
        return (<option value={item.value} key={i}>{item.label}</option>);
      });
    }
    return options;
  },

  /**
   * Build Select template
   * @returns {JSX template}
   */
  getSelect : function(){
    var fieldName = this.props.name;
    var fieldKey = fieldName +'-fieldSelect';
    var helpKey = 'field'+this.props.name+'HelpText';
    var isMultiSelect = this.props.type == 'multiselect';
    return (
        <select multiple={isMultiSelect} className="form-control field" value={this.state.value} key={fieldKey} id={fieldName} name={fieldName} ref={fieldName} aria-describedby={helpKey} onChange={this.handleChange} onBlur={this.handleBlur} >
          {this.getSelectOptions()}
        </select>
      );
  },    

  /**
   * Wraps label and returns template
   * @returns {JSX template}
   */
  getLabel : function(){
    var labelRequired = ''; 
    var labelKey = 'fieldLabel';
    if(this.props.required){
      labelRequired = <span className="text-danger" key="requiredField">*</span>;
      labelKey = 'fieldLabelRequired';
    }
    if(this.isFieldGroup()){
      return (<legend htmlFor={this.props.name} className="field-legend" key={labelKey} >{labelRequired}{this.props.label}</legend>)
    }else{
      return (<label htmlFor={this.props.name} className="field-label" key={labelKey}>{labelRequired}{this.props.label}</label>)
    }
  },

  /**
   * Creates specified field type template
   * @returns {JSX template}
   */
  getField : function(){
      var fieldType = this.props.type;
      var fieldKey = 'field'+fieldType;
      var helpKey = 'field'+this.props.name+'HelpText';
      var field = null;

      switch(fieldType){
        case 'textarea':
          field = (<textarea className="form-control field"  id={this.props.name} name={this.props.name} value={this.state.value} ref={this.props.name} key="fieldTextarea"  aria-describedby={helpKey} onChange={this.handleChange} onBlur={this.handleBlur} ></textarea>);
          break;  
        case 'radio':  
        case 'checkbox':
          field = this.getCheckboxOrRadio();
          break;      
        case 'select':
        case 'multiselect':
          field = this.getSelect();
          break;     
        default:
          field = (<input type={fieldType} id={this.props.name} className="form-control field" name={this.props.name} value={this.state.value} key={fieldKey}  ref={this.props.name} placeholder="" aria-describedby={helpKey} onChange={this.handleChange} onBlur={this.handleBlur} />);
      }
      return field;
  },

  /**
   * Display helpText or errorMessage if available.
   * @returns {JSX template}
   */
  getHelpText: function(){
    var helpKey = 'field'+this.props.name+'HelpText';
    var helpText = this.props.helpText ? this.props.helpText : '';
    if(this.state.hasError){
      helpText = this.state.errorMessage;
    }

    return (<span id={helpKey} key={helpKey} className="help-block">{helpText}</span>);
  },

  /**
   * Wraps checkbox or radio fields with specific label and field template 
   * and returns new template
   * @returns {JSX template}
   */
  renderFieldGroup : function(label,field,helpText){
    var classes = {
      'checkbox': this.props.type === 'checkbox',
      'radio': this.props.type === 'radio'
    };

    return  (
      <fieldset className={React.addons.classSet(this.getRenderViewClasses())} key="fieldGroup">
        {this.getEditController("Field")}
        {label}
        <div className={React.addons.classSet(classes)} key="fieldGroupContent">
          {field}
        </div>
        {helpText}
      </fieldset>
    );
  },

  /**
   * Wraps label and field templates and returns new template
   * @returns {JSX template}
   */
  renderFieldWithLabel : function(label,field,helpText){
    return  (
      <div className={React.addons.classSet(this.getRenderViewClasses())} key="fieldDefaultGroup">
        {this.getEditController("Field")}
        {label}
        {field}
        {helpText}
      </div>
    );
  },

  /**
   * Render a Field component.
   * @returns {JSX}
   */
  render: function(){
    if(this.isFieldGroup()){
      return this.renderFieldGroup(
        this.getLabel(),
        this.getField(),
        this.getHelpText()
      );
    }else{
      return this.renderFieldWithLabel(
        this.getLabel(),
        this.getField(),
        this.getHelpText()
      );
    }
  }
  
});