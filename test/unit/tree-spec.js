var React = require('react');
var Components = require('../../src/main');
var Tree = Components.elements.tree;
var TestUtils = require('react/lib/ReactTestUtils');
var _ = require('lodash');
var fixture = require('../fixtures/tree.json');

describe('Tree component', function(){	
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