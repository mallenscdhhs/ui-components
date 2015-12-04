import React from 'react';

/**
 * Required for using TestUtils.findAllInRenderedTree variants.
 * @class ComponentWrapper
 */
export default React.createClass({
  render() {
    return <div {...this.props}>{this.props.children}</div>
  }
});
