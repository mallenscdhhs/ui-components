var React = require('react/addons');
var _ = require('underscore');
var Q = require('./EventQueue');

var Field = React.createClass({

  /**
   * Upon mounting, subscribe to any dependency that the field has, an monitor the field
   * for events that would require you to make a state change.
   * @returns {void}
   */
  componentDidMount: function(){
    if(this.hasDependency()){
      var comp = this;
      var initState = comp.props.dependency.initialState === 'hidden' ? false : true;
      var depName = comp.props.dependency.name;
      var depValues = comp.props.dependency.value.split('|'); // Array of 'actionable' values
      Q.subscribe('field:blur:'+depName,'field:'+comp.props.name,function(data){
        // Verify field is correct and new value is in the 'actionable' array
        if(data.fieldName === depName && depValues.indexOf(data.fieldValue) >= 0){ 
          // Change from initial display state.
          comp.setState({display: !initState}); 
        }else{
          // Otherwise, revert to (or stay at) initState
          comp.setState({display: initState})
        }
      });
    }      
  },

  /**
   * UnSubscribe from any dependent field events that the current field was listening to.
   * @returns {void}
   */
  componentWillUnmount: function(){
    if(this.hasDependency()){
      var depName = this.props.dependency.name;
      Q.unSubscribe('field:blur:'+depName,'field:'+this.props.name);
    }    
  },

  /**
   * Check if the field has a dependency, which requires name, value and initialState to be set
   * @returns {boolean}
   */
  hasDependency: function(){
    return this.props.dependency && this.props.dependency.name && this.props.dependency.value && this.props.dependency.initialState;
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
    return {'value': this.props.value, 'display': viewableState};
  },

  /**
   * Event handler for onBlur, that pushes a message to the queue, with the field's name and value.
   * @returns {void}
   */
  handleBlur: function(){
    console.log('BLUR:'+this.props.name+':VALUE:'+this.state.value+':');
    Q.push({'entityEvent':'field:blur:'+this.props.name,'data':{'fieldName':this.props.name,'fieldValue':this.state.value}});
  },

  /**
   * Event handler for onChange, that updates the field's state with the new value
   * @returns {void}
   */
  handleChange: function(event) {
    this.setState({value: event.target.value});
    //console.log('CHANGE:'+this.props.name+':VALUE:'+this.state.value+':');
    //Q.push({'entityEvent':'field:change:'+this.props.name,'data':{'fieldName':this.props.name,'fieldValue':this.state.value}});
  },  

  /**
   * Based on display state, return group of classes for the form group container
   * @returns {object}
   */
  getRenderViewClasses: function(){
    var classes = {
      'form-group' : true,
      'hidden' : !this.state.display
    } 
    return classes;
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
    var fields = this.props.options.items.map(function(item, i){
      fieldKey = fieldType + 'Option' + i;
      labelKey = fieldType + 'Label' + i;
      return (<label key={labelKey}><input type={fieldType} id={fieldName} name={fieldName} value={item.value} key={fieldKey}  onChange={this.handleChange} onBlur={this.handleBlur}  />{item.label}</label>);
    });
    return fields;
  },


  /**
   * Build Select template
   * @returns {JSX template}
   */
  getSelect : function(){
    var fieldName = this.props.name;
    var fieldKey = fieldName +'-fieldSelect';
    var isMultiSelect = this.props.type == 'multiselect';
    return (
        <select multiple={isMultiSelect} className="form-control" key={fieldKey} id={fieldName} onChange={this.handleChange} onBlur={this.handleBlur}>
          {this.props.options.items.map(function(item, i){
            return (<option value={item.value} key={i}>{item.label}</option>);
          })}
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
      return (<legend htmlFor={this.props.name} className="field-legend" key={labelKey}>{labelRequired}{this.props.label}</legend>)
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
      var field = null;

      switch(fieldType){
        case 'textarea':
          field = (<textarea className="form-control"  id={this.props.name}  key="fieldTextarea" onChange={this.handleChange} onBlur={this.handleBlur} defaultValue={this.props.value} />);
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
          field = (<input type={fieldType} id={this.props.name} className="form-control" key={fieldKey}  placeholder="" defaultValue={this.props.value} onChange={this.handleChange} onBlur={this.handleBlur} />);                                                                                  
      }
      return field;
  },

  /**
   * Wraps checkbox or radio fields with specific label and field template 
   * and returns new template
   * @returns {JSX template}
   */
  renderFieldGroup : function(label,field){
    var fieldClasses = {
      'checkbox': this.props.type === 'checkbox',
      'radio': this.props.type === 'radio'
    };

    return  (
      <fieldset className={React.addons.classSet(this.getRenderViewClasses())} key="fieldGroup">
        {label}
        <div className={React.addons.classSet(fieldClasses)} key="fieldGroupContent">
          {field}
        </div>
      </fieldset>
    );
  },

  /**
   * Wraps label and field templates and returns new template
   * @returns {JSX template}
   */
  renderFieldWithLabel : function(label,field){
    return  (
      <div className={React.addons.classSet(this.getRenderViewClasses())} key="fieldDefaultGroup">
        {label}
        {field}
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
        this.getField()
      );
    }else{
      return this.renderFieldWithLabel(
        this.getLabel(),
        this.getField()
      );
    }
  }
  
});
