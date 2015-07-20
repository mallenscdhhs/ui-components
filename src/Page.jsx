'use-strict';
var React = require('react');
var Content = require('./Content');

module.exports = React.createClass({

  displayName: 'Page',

  /**
   * Set default props.
   * @returns {object}
   */
  getDefaultProps: function(){
    return {
      content: '',
      title: '',
      componentType: 'page'
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
        <Content key="content" ref="content" content={this.props.content} />
        {this.props.children}
      </article>
    );
  }
});
