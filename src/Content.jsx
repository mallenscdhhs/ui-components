'use-strict';
import React from 'react';
import setClassNames from 'classnames';
import DependencyMixin from './DependencyMixin';

export default React.createClass({

  displayName: 'Content',

  mixins: [DependencyMixin],

  propTypes: {
    content : React.PropTypes.string,
    className : React.PropTypes.string
  },

  statics: {
    configure: function(schema, model, components){
      return schema.get('config').toJSON();
    }
  },

  getDefaultProps() {
    return {
      componentType: 'content',
      className: ''
    };
  },

  getInitialState() {
    return null;
  },

  getClassNames() {
    return setClassNames(
      'page-content',
      {hidden: !this.state.visible},
      this.props.className
    );
  },

  render() {
    return (
      <section className={this.getClassNames()} dangerouslySetInnerHTML={{__html: this.props.content }}></section>
    );
  }

});
