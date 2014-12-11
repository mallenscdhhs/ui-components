var React = require('react/addons');
var Container = require('./Container');
var Action = require('./Action');
var EditorMixin = require('./EditorMixin');

module.exports = React.createClass({
  displayName: 'Form',

  mixins: [EditorMixin],

  getDefaultProps: function(){
    return {
      name: '',
      actions: []
    };
  },

  /**
   * Create actions component template
   * @returns {JSX Template} 
   */
  getActions: function(){
    var actions;
    if(this.props.actions){
      actions = this.props.actions.map(function(action,i){
        return <Action type={action.type} {...action.config} key={"actionKey"+i} />
      });       
    }
    return actions;
  },

  /**
   * Render a Form component.
   * @returns {JSX} 
   */
  render: function(){ 
    var formName = this.props.name ? (this.props.name).replace(/ /g,'_') : '';
    return (
      <form name={formName} id={formName} key={"formWithComponentsKey"+formName} className="editable-component">
        {this.getEditController("Form")}
        {this.props.children}
        <Container classes="form-group" key={"containerActions"+formName}>{this.getActions()}</Container>
      </form>
    );
  }
  
});