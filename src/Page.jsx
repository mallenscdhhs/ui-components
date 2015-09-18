'use-strict';
var React = require('react');
var Content = require('./Content');
import renderChildren from './render-children';

class Page extends React.Component {

  /**
   * Render a Page component to the screen.
   * @returns {JSX}
   */
  render(){
    return (
      <article>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <Content key="content" ref="content" content={this.props.content} />
        {renderChildren(this.props)}
      </article>
    );
  }
};

Page.propTypes = {
  title: React.PropTypes.string
};

Page.defaultProps = {
  content: '',
  title: '',
  componentType: 'page'
};

export default Page;
