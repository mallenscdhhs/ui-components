var Queue = require('./EventQueue');

module.exports = {

  /**
   * Determine if this field has a configured dependency
   * @returns {boolean}
   */
  hasDependency: function(){
    return !!this.props.dependency;
  },

  /**
   * Upon mounting, subscribe to any dependency that the field has, and monitor the field
   * for events that would require you to make a state change.
   */
  componentDidMount: function(){    
    if(this.hasDependency()){      
      var initState = this.props.dependency.initialState === 'hidden' ? false : true;
      var depName = this.props.dependency.id;
      var depValues = this.props.dependency.value.split('|'); // Array of 'actionable' values
      Queue.subscribe('field:value:change:'+depName, 'field:'+this.props.id+':dependency', function(data){
        // Verify field is correct and new value is in the 'actionable' array
        if ( data.name === depName && depValues.indexOf(data.value) >= 0){ 
          // Change from initial display state.
          this.setState({display: !initState}); 
        }else{
          // Otherwise, revert to (or stay at) initState
          this.setState({display: initState});
        }
      }.bind(this));
    }
  },

  /**
   * UnSubscribe from any dependent field events that the current field was listening to.
   * @returns {void}
   */
  componentWillUnmount: function(){
    if(this.hasDependency()){
      var depName = this.props.dependency.id;
      Queue.unSubscribe('field:value:change:'+depName,'field:'+this.props.id+':dependency');
    }
  }  

};