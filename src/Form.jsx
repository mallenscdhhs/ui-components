var React = require('react/addons');
var Container = require('./Container');
var Action = require('./Action');
var Q = require('./EventQueue');

module.exports = React.createClass({

  getDefaultProps: function(){
    return {
      name: '',
      actions: []
    };
  },

  componentDidMount: function(){
    Q.subscribe('button:next','form',function(data){
      console.log('Form got event!'+JSON.stringify(data));
      Q.unSubscribe('button:next','form');
    });
    Q.subscribe('all','form',function(data){
      console.log('Form got ALL event!'+JSON.stringify(data));
    });    
  },

  componentWillUnmount: function(){
    Q.unSubscribe('button:next','form');
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
    var formName = this.props.name ? (this.props.name).replace(' ','_') : '';
    return (
      <form name={formName} key="formWithComponentsKey">
        {this.props.children}
        <Container classes="form-group" key="containerActions">{this.getActions()}</Container>
      </form>
    );
  }
  
});
