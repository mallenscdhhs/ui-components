var React = require('react/addons');
var Container = require('./Container');
var Action = require('./Action');

module.exports = React.createClass({
  displayName: 'Form',

  getDefaultProps: function(){
    return {
      name: '',
      actions: []
    };
  },

  componentDidMount: function(){
  
  },

  componentWillUnmount: function(){

  },

  handleConfigEdit: function(){
    console.log(this.props);
    // PUSH this.props to QUEUE
  },

  getDisplayName: function(){
    return 'Form'
  },

  getEditController: function(){
    return <div className="config-editor bg-primary label label-primary" onClick={this.handleConfigEdit}>{this.getDisplayName()} Edit</div>;
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
      <form name={formName} key={"formWithComponentsKey"+formName} className="editable-component">
        {this.getEditController()}
        {this.props.children}
        <Container classes="form-group" key={"containerActions"+formName}>{this.getActions()}</Container>
      </form>
    );
  }
  
});