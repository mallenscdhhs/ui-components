var React = require('react/addons');
var _ = require('underscore');
var ConfigLoader = require('./ConfigLoader');
var Layout = require('./Layout');
var marked = require('marked');

marked.setOptions({  
  sanitize: true,
  smartLists: true
});

var Page = React.createClass({
  mixins: [ConfigLoader],
  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    return _.extend({ 
      title: '', 
      content: '', 
      components: []
    }, this.props);    
  },

  /**
   * Render a Page component to the screen.
   * @returns {JSX}
   */
  render: function(){       
    return(
      <article>
        <header>
          <h2>{this.state.title}</h2>
        </header>
        <section dangerouslySetInnerHTML={{__html: marked(this.state.content)}}></section>
        <Layout schema={this.state.layout} components={this.state.components}/>
      </article>
    );
  }
});

module.exports = Page;
