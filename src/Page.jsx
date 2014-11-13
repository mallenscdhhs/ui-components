var React = require('react/addons');
var Layout = require('./Layout');
var marked = require('marked');

marked.setOptions({  
  sanitize: true,
  smartLists: true
});

var Page = React.createClass({
  /**
   * Set initial state.
   * @returns {object}
   */
  getInitialState: function(){
    return {};    
  },
  
  /**
   * Set default props.
   * @returns {object}
   */
  getDefaultProps: function(){
    return {
      content: '',
      title: '',
      components: []
    }
  },

  /**
   * Render a Page component to the screen.
   * @returns {JSX}
   */
  render: function(){       
    return(
      <article>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <section dangerouslySetInnerHTML={{__html: marked(this.props.content)}}></section>
        <Layout schema={this.props.layout} components={this.props.components}/>
      </article>
    );
  }
});

module.exports = Page;
