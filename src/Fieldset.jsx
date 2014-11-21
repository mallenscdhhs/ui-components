var React = require('react/addons');
var Field = require('./Field');

module.exports = React.createClass({
  
  getComponents: function(){
    var comps;    
    if(this.props.components){
      comps = this.props.components.map(function(field,i){
        return <Field {...field.config} key={"fieldKey"+i} />
      }) ;  
    }
    return comps;
  },

  /**
   * Render a Fieldset component.
   * @returns {JSX}
   */
  render: function(){
    return (
        <fieldset key="fieldSetWithComponentsKey">
          <legend className="field-label" key="legendKey">{this.props.name}</legend>
          {this.getComponents()}
        </fieldset>
      );
  }

});