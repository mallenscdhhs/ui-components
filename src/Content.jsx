'use-strict';
import React from 'react';
import setClassNames from 'classnames';
import DependencyMixin from './DependencyMixin';

module.exports = React.createClass({

  displayName: 'Content',

  mixins: [DependencyMixin],

  propTypes: {
    'content' : React.PropTypes.string
  },

  statics: {
    configure: function(schema, model, components){
      return schema.get('config').toJSON();
    }
  },

  getDefaultProps: function(){
    return {
      'componentType': 'content'
    };
  },

  getInitialState: function() {
    return null;
  },

  getClassNames: function(){
    return setClassNames(
      'page-content',
      {'hidden': !this.state.visible}
    );
  },

  render: function(){
    return (
      <section className={this.getClassNames()} dangerouslySetInnerHTML={{__html: this.props.content }}></section>
    );
  }

});
