var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Workflow = require('../../dist/cjs/Workflow');

describe('Workflow component', function(){
	describe('#getStartPageId', function(){
		it('can derive the starting pageId from "lastSectionCompleted"', function(){
			var props = {
				items: [{pageId: 'one'}, {pageId: 'two'}, {pageId: 'three'}],
				lastSectionCompleted: 'two'
			};
			var wf = TestUtils.renderIntoDocument(<Workflow {...props}/>);
			expect(wf.getStartPageId()).toEqual('three');
		});
		it('will return the pageId from the first item in the items list if no "lastSectionCompleted" provided');
	});
});