var React = require('react/addons');
var _ = require('underscore');

var Page = React.createClass({

  getInitialState: function(){
    var state = _.extend({ title: '', content: [], components: [], layout: {} }, this.props);
    return state;
  },

  render: function(){
    return(
      <article>
        <header>
          <h2>{this.state.title}</h2>
        </header>
        <section>
          {this.state.content.map(function(item, i){
            item.config.key = 'content-item-'+i;
            return React.createElement(item.type, item.config, item.config.text);
          })}
        </section>
      </article>
    );
  }
});

module.exports = Page;
