describe('Tree component', function(){	
	var Tree = Components.elements.tree;
	var TestUtils = React.addons.TestUtils;
	var _ = require('lodash');

	var fixture = {
		title: 'test tree',
		api: {},
		items: [
			{
				title: 'One',
				pageId: 'page1',
				items: [
					{
						title: 'One b',
						pageId: 'page1b'
					},
					{
						title: 'One a',
						pageId: 'page1a'
					}
				]
			},
			{
				title: 'Two',
				pageId: 'page2'
			}
		]
	};
	it('can render a nested list structure', function(){
		var tree = TestUtils.renderIntoDocument(<Tree {...fixture}/>).getDOMNode();
		var firstLeaf = tree.childNodes[0];
		var firstLeafTree = firstLeaf.childNodes[1];
		expect(tree.tagName).toEqual('UL');
		expect(tree.childNodes.length).toEqual(2);
		expect(firstLeafTree.childNodes.length).toEqual(2);
		expect(firstLeaf.tagName).toEqual('LI');		
		expect(firstLeaf.childNodes[0].textContent).toEqual(fixture.items[0].title);
		//expect(tree.childNodes[0].childNodes[1].textContent).toEqual(fixture.items[0].items[1].title);
	});
});