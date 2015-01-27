var React = require('react');
require('es6-promise').polyfill();
var Components = require('../../src/main');
var Tree = Components.elements.tree;
var TestUtils = require('react/lib/ReactTestUtils');
var _ = require('lodash');
var fixture = require('../fixtures/tree.json');

describe('Tree component', function(){
	it('will render if passed children', function(){
		var tree = TestUtils.renderIntoDocument(<Tree><li>test</li></Tree>).getDOMNode();
		var firstLeaf = tree.childNodes[0];
		expect(tree.tagName).toEqual('UL');
		expect(tree.childNodes.length).toEqual(1); // +1 for EditorToggle mixin for tree component
		expect(firstLeaf.tagName).toEqual('LI');
		expect(firstLeaf.childNodes[0].textContent).toEqual('test');		
	});
});
