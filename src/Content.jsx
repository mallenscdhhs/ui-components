'use-strict';
import React from 'react';
import setClassNames from 'classnames';

/**
 * Render a Content component.
 * @returns {JSX}
 */
 class Content extends React.Component {
  constructor() {
    super();
    this.getClassNames = this.getClassNames.bind(this);
  }

  getClassNames() {
    return setClassNames(
      'page-content',
      {hidden: !this.props.visible},
      this.props.className
    );
  }

  render() {
    return (
      <section className={this.getClassNames()} dangerouslySetInnerHTML={{__html: this.props.content}}></section>
    );
  }
}

Content.propTypes = {
  content: React.PropTypes.string,
  className: React.PropTypes.string
};

Content.defaultProps = {
  componentType: 'content',
  className: ''
};

export default Content;
