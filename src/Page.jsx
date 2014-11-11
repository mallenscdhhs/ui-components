var React = require('react/addons');
var _ = require('underscore');
var ConfigLoader = require('./ConfigLoader');
var Layout = React.createFactory(require('./Layout'));

var componentTypes = {
  form: require('./Form'),
  //workflow: require('./Workflow')
};

var Page = React.createClass({
  mixins: [ConfigLoader],
  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    return _.extend({ 
      title: '', 
      content: [], 
      components: [], 
      layout: {
        components: []
      } }, this.props);    
  },

  /**
   * Render a Page component to the screen.
   * @returns {JSX}
   */
  render: function(){
    if ( this.state.layout.type ) {
      this.state.layout.components = this.state.components.map(function(component){
        return componentTypes[component.type](component.config);
      });
    }
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
          {Layout(this.state.layout)}
        </section>
      </article>
    );
  }
});

module.exports = Page;
