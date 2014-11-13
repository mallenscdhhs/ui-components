var React = require('react/addons');
var request = require('superagent');
var Grid = require('./Grid');
var Page = require('./Page');
var Tree = require('./Tree');

var Workflow = React.createClass({

	propTypes: {
		title: React.PropTypes.string,
		items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		api: React.PropTypes.object.isRequired
	},
	
  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    return {
      currentPage: '',
      previousPage: '',
      currentPageProps: {}
    };
  },
  
  /**
   * Fetch a page instance from the server with the passed-in pageId, and
   * set the currentPageProps state with the results.
   * @param {string} pageId
   */
  loadPageFromServer: function(pageId){
    var pageURL = this.props.api.get.replace(':pageId', pageId);
    request.get(pageURL, function(res){
      if ( res.ok ) {
        this.setState({currentPageProps: res.body.config});
      }
    }.bind(this));
  },
  
  /**
   * Load the first page in the workflow. This method will first look for
   * a URL hash to specify the pageId, or else it will use the first item
   * in the tree nav.
   */
  componentDidMount: function(){
    var hash = window.location.hash;
    var pageId = hash? hash.slice(1) : this.refs.outline.state.selectedItem;
    this.loadPageFromServer(pageId);
    this.refs.outline.on('item:select', function(){
      console.log(arguments);
    });
  },
	
  /**
   * 
   * @returns {React}
   */
  render: function(){
    return (
      <Grid rows={[[{md: '4', indexRange: [0, 2]}, {md: '8'}]]}>
        <h3>{this.props.title}</h3>
        <Tree {...this.props} ref="outline" />
        <Page {...this.state.currentPageProps}  ref="currentPage" />
      </Grid>
    );
	}
});

module.exports = Workflow;