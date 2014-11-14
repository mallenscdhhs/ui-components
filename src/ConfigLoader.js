var request = require('superagent');
/**
 * Load the component schema instance from the server if the component
 * has a "url" property provided.
 * @module ConfigLoader
 */
module.exports = {
  componentDidMount: function(){    
    if ( this.props.url ) {
      request.get(this.props.url, function(res){        
        if ( res.ok && this.isMounted() ) {
          this.setState(res.body.config);
        }
      }.bind(this));
    }
  }
};
