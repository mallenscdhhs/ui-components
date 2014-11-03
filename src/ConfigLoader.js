var request = require('superagent');
/**
 * Load the component schema instance from the server if the component
 * has a "url" property provided.
 * @module ConfigLoader
 */
module.exports = {
  componentDidMount: function(){
    var component = this;
    if ( this.props.url ) {
      request.get(this.props.url, function(res){
        if ( res.status === 200 ) {
          component.setState(res.body.config);
        }
      });
    }
  }
};
