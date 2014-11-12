var React = require('react/addons');
var ConfigLoader = require('./ConfigLoader');
var Grid = require('./Grid');
var Page = require('./Page');
var Tree = require('./Tree');

var Workflow = React.createClass({
	mixins: [ConfigLoader],
	propTypes: {
		url: React.PropTypes.string
	},
	
  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    return _.extend({ 
      title: '', 
      items: [], 
      api: {
        get: '',
        put: '',
        post: '',
        'delete': ''
      } 
    }, this.props);
  },
	
  /**
   * 
   * @returns {React}
   */
  render: function(){
    var pageId = this.state.items[0].pageId;
    var pageURL = this.state.api.get.replace(':pageId', pageId);
    return (
      <Grid rows={[[{md: '4'}, {md: '8'}]]}>
        <Tree {...this.state} />
        <Page url={pageURL} />
      </Grid>
    );
	}
});

module.exports = Workflow;