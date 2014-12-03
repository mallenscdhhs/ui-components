var React = require('react/addons');
var _ = require('underscore');
var Page = require('./Page');
var Tree = require('./Tree');
var Grid = require('./Grid');
var Queue = require('./EventQueue');

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
    var current = this.props.items[this.props.lastSectionCompleted].next;
    return this.getFlow(current);
  },
  
  getFlow:function(current){
    var list = _.extend({},this.props.items);
    var keys = Object.keys(list);
    _.each(keys,function(k){
      list[k].disabled = false; 
      list[k].active = false; 
    });    
    var flow = this.getWorkflowState(list, list[current].pageId);
    var currentPage = flow[current].pageId;
    flow[current].active = true;
    return {
      'currentPage': currentPage,
      'flow': flow
    };    
  },

  /**
   * Load the first page in the workflow. This method will first look for
   * a URL hash to specify the pageId, or else it will use the first item
   * in the tree nav.
   */
  componentDidMount: function(){
    var startPageId = this.props.lastSectionCompleted ? this.state.flow[this.props.lastSectionCompleted].next : (Object.keys(this.state.flow)[0].pageId);
    var currentPage = this.props.currentPage ? this.props.currentPage : startPageId;
    this.setState({'currentPage': currentPage});     
    var component = this;
    Queue.subscribe('tree:load:page','workflowRouter',function(data){
      component.handleDirect(data.pageId);
    });
  },

  componentWillUnmount: function(){
    Queue.unSubscribe('tree:load:page','workflowRouter');
  },

  handleDirect: function(page){
      this.replaceState(this.getFlow(page));
      this.forceUpdate();
      Queue.push({'entityEvent':'workflow:load:page','data':{'page':page}}); 
  },

  handleNext: function(){
    var nextPage = this.state.flow[this.state.currentPage].next ? this.state.flow[this.state.currentPage].next :  this.state.currentPage;
    if(nextPage !== this.state.currentPage){
      this.replaceState(this.getFlow(nextPage));
      this.forceUpdate();
      Queue.push({'entityEvent':'workflow:load:page','data':{'page':nextPage}});    
    }
  },

  handlePrevious: function(){
    var previousPage = this.state.flow[this.state.currentPage].previous ? this.state.flow[this.state.currentPage].previous : this.state.currentPage;
    if(previousPage !== this.state.currentPage){
      this.replaceState(this.getFlow(previousPage));
      this.forceUpdate();
      Queue.push({'entityEvent':'workflow:load:page','data':{'page':previousPage}});
    }
  },

  handleSave: function(){
    Queue.push({'entityEvent':'workflow:save:application','data':{'page':this.state.currentPage}});
  }, 

  getWorkflowState: function(list, id){ 
    var next = list[id].next; 
    if ( next ) {
      list[next].disabled = true;
      list[next].active = false;
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
      <Grid rows={[[{md: '2', indexRange: [0, 2]}, {md: '10'}],[{md : '2'},{md:'10'}]]}>
        <h4>{this.props.title}</h4>
        <Tree {...treeProps} ref="outline" />
        <div id="workflow-page" ></div>
        <div id="workflow-status"></div>
        <div id="workflow-actions">
          <button type="button" id="workflowActionNext" key="workflowActionNexxt" className="btn btn-success pull-right" onClick={this.handleNext}>Next</button>
          <button type="button" id="workflowActionSave" key="workflowActionSave" className="btn btn-primary pull-right" onClick={this.handleSave}>Save</button>
          <button type="button" id="workflowActionPrevious" key="workflowActionPrevious" className="btn btn-default pull-left" onClick={this.handlePrevious}>Previous</button>
        </div>
      </Grid>
    );
	}
});