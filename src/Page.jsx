var React = require('react/addons');
var marked = require('marked');
var Components = require('./Components');
var Layout = Components.element('layout');

marked.setOptions({  
  sanitize: true,
  smartLists: true
});

var Page = React.createClass({
  displayName: 'Page',

  /**
   * Set default props.
   * @returns {object}
   */
  getDefaultProps: function(){
    return {
      content: '',
      title: '',
      components: []
    };
  },

  /**
   * Render a Page component to the screen.
   * @returns {JSX}
   */
  render: function(){
    return (
      <article>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <section dangerouslySetInnerHTML={{__html: marked(this.props.content)}}></section>
        <Layout schema={this.props.layout}>
          {this.props.components.map(function(component){
            return Components.factory(component.type)(component.config);            
          }, this)}
        </Layout>
      </article>
    );
  }
});

module.exports = Page;