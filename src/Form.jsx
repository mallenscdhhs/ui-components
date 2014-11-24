var React = require('react/addons');
var Container = require('./Container');
var Action = require('./Action');

module.exports = React.createClass({

  getDefaultProps: function(){
    return {
      name: '',
      actions: []
    };
  },

  /**
   * Render a Form component.
   * @returns {JSX}
   */
  render: function(){ 
    var formName = (this.props.name).replace(' ','_');
       
    return (
    	<form name={formName} key="formWithComponentsKey">
        {this.props.children}
        <Container classes="form-group" key="containerActions">
          {this.props.actions.map(function(action,i){
            return <Action type={action.type} {...action.config} key={"actionKey"+i} />
          })}
        </Container>
    	</form>
    );
  }

});