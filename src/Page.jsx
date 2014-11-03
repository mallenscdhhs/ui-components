var React = require('react/addons');
var _ = require('underscore');
var ConfigLoader = require('./ConfigLoader');

var Page = React.createClass({
  mixins: [ConfigLoader],
  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    var state = _.extend({ title: '', content: [], components: [], layout: {} }, this.props);
    return state;
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
