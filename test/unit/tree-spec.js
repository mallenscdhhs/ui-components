import React from 'react';
import Tree from '../../src/Tree';
import TestUtils from 'react/lib/ReactTestUtils';
import _ from 'lodash';

let fixture = require('../fixtures/tree.json');

describe('Tree component', function(){
	it('will render if passed children', function(){
		let tree = TestUtils.renderIntoDocument(<Tree><li>test</li></Tree>).getDOMNode();
		let firstLeaf = tree.childNodes[0];
		expect(tree.tagName).toEqual('UL');
		expect(tree.childNodes.length).toEqual(1);
		expect(firstLeaf.tagName).toEqual('LI');
		expect(firstLeaf.childNodes[0].textContent).toEqual('test');
	});
});
