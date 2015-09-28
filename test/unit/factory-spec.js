'use-strict';
import React from 'react';
import Factory from '../../src/Factory';
import elements from '../../src/index';
import TestUtils from 'react/lib/ReactTestUtils';
import Immutable from 'immutable';

let config = require('../fixtures/page-with-layout.json');
let fixture = Immutable.fromJS(config).setIn(['config','schema'], config).toJS();

function testRenderedOutput(result){
  let dom = TestUtils.renderIntoDocument(result);
  let columns = TestUtils.scryRenderedDOMComponentsWithClass(dom, 'col-md-6');
  let page = TestUtils.findRenderedDOMComponentWithTag(dom, 'article');
  let title = TestUtils.findRenderedDOMComponentWithTag(page, 'h2');
  expect(page).toBeDefined();
  expect(columns.length).toEqual(2);
  expect(title.getDOMNode().innerHTML).toEqual(fixture.config.title);
}

function testNonRenderedOutputFromElement(el){
  let dom = TestUtils.renderIntoDocument(el);
  let findArticle = TestUtils.findRenderedDOMComponentWithTag.bind(TestUtils, dom, 'article');
  let divs = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'div');
  // should not render the Page component
  expect(findArticle).toThrow();
  // should render a single <div>
  expect(divs.length).toEqual(1);
}

describe('Factory', function(){

  describe('#build', function(){
    it('can render a component schema', function(){
      let result = Factory.build(elements, fixture, fixture)[0];
      testRenderedOutput(result);
    });
    it('will not render if schema is not provided', function(){
      let result = Factory.build.bind(null, elements, null, fixture);
      expect(result).toThrowError(TypeError, 'You must provide a root schema to Factory#build.');
    });
    it('will not render if elements is not provided', function(){
      let result = Factory.build.bind(null, null, fixture, fixture);
      expect(result).toThrowError(TypeError, 'You must provide a list of elements to Factory#build.');
    });
  });

  describe('element', function(){
    it('can render a component schema', function(){
      let result = <Factory elements={elements} schema={fixture} head={fixture}/>;
      testRenderedOutput(result);
    });
    it('will not render if schema is not provided', function(){
      testNonRenderedOutputFromElement(<Factory elements={elements} head={fixture}/>);
    });
    it('will not render if head is not provided', function(){
      testNonRenderedOutputFromElement(<Factory elements={elements} schema={fixture}/>);
    });
    it('will not render if elements is not provided', function(){
      testNonRenderedOutputFromElement(<Factory schema={fixture} head={fixture}/>);
    });
  })

});
