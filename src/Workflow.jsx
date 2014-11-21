var React = require('react/addons');
var _ = require('underscore');
var Page = require('./Page');
var Tree = require('./Tree');
var Grid = require('./Grid');

module.exports = React.createClass({
  
  displayName: 'Workflow',

	propTypes: {
		title: React.PropTypes.string,
		items: React.PropTypes.object.isRequired,
    lastSectionCompleted: React.PropTypes.string
	},

  /**
   * Load the initial state of the component from any passed-in props, and
   * set defaults for any props that were not set.
   * @returns {object}
   */
  getInitialState: function(){
    var flow = this.getWorkflowState(_.clone(this.props.items), this.props.items[this.props.lastSectionCompleted].next);
    var lastSection = flow[this.props.lastSectionCompleted];
    var currentSection = flow[lastSection.next];
    return {
      currentPage: currentSection.pageId,
      previousPage: '',
      currentPageProps: currentSection,
      flow: flow
    };
  },
  
  /**
   * Load the first page in the workflow. This method will first look for
   * a URL hash to specify the pageId, or else it will use the first item
   * in the tree nav.
   */
  componentDidMount: function(){
    var startPageId = this.props.lastSectionCompleted? this.state.flow[this.props.lastSectionCompleted].next : this.refs.outline.items[0].pageId;
    this.setState({currentPage: startPageId});      
    this.refs.outline.selectItem(startPageId);
  },  

  /**
   * Deregister event handlers, perform component cleanup.
   */
  componentWillUnmount: function(){
    
  },

  next: function(){},
  prev: function(){},
  cancel: function(){},

  getWorkflowState: function(list, id){
    var next = list[id].next;    
    if ( next ) {
      list[next].disabled = true;
      this.getWorkflowState(list, next);
    }
    return list;
  },

  buildTree: function(source, head, children){ 
    var tree = [];
    while(head){
      var branches = children[head.pageId];   
      var next = source[head.next];
      if ( !!branches ) {
        head.items = children[head.pageId];   
      }
      tree.push(head);    
      head = ( next && branches )? source[next.next] : next;
    }
    return tree;
  },
	
  /**
   * 
   * @returns {React}
   */
  render: function(){
    // list of page configs
    var values = _.values(this.state.flow);
    // list of all "next" pageId's
    var nexts = _.map(values, function(item, i){
      return item.next;
    });
    // the first item in the linked list
    var head = _.difference(Object.keys(this.state.flow), nexts)[0];
    // hash of all pages with sub items
    var childrenGroups = _.groupBy(_.filter(values, function(item){
      return !!item.parentId;
    }), 'parentId');

    var treeProps = {
      items: this.buildTree(this.state.flow, this.state.flow[head], childrenGroups)
    };
  
    return (
      <Grid rows={[[{md: '4', indexRange: [0, 2]}, {md: '8'}]]}>
        <h4>{this.props.title}</h4>
        <Tree {...treeProps} ref="outline" />
        <Page {...this.state.currentPageProps}  ref="currentPage" />
      </Grid>
    );
	}
});