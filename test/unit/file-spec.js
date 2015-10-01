import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import File from '../../src/File';
import _ from 'lodash';

let fixture = require('../fixtures/file.json');

describe('File', () => {
  let config = _.omit(fixture, 'file');
  let comp = TestUtils.renderIntoDocument(<File {...config}/>);

  it('renders an input with a type of file', () => {
    let input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');
    let dom = React.findDOMNode(comp);
    expect(input).toBeDefined();
    expect(dom.type).toEqual('file');
  });

  it('can pass an uploaded file to the application to be persisted', () => {
    let uploadedFile = _.omit(fixture.file, 'binary');
    let e = {target: {files: [uploadedFile]}};
    comp.handleInputChange(e);
    expect(e.component.file).toEqual({
      id: comp.props.id,
      name: comp.props.name,
      properties: uploadedFile
    });
  });

  xit('can render a link to preview the file in a new tab when provided in the schema', () => {
    // simulate re-render from schemaUpdate
    comp.props.file = fixture.file;
    comp.setState();
    let input = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');
    let previewLink = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');
    let dom = React.findDOMNode(previewLink);
    expect(_.isEmpty(input)).toBe(true);
    expect(previewLink).toBeDefined();
    expect(dom.id).toEqual(`preview-link-${fixture.id}`);
    expect(dom.href).toEqual(comp.props.file.binary);
  });

  xit('can render an edit link to handle changes to previously uploaded files', () => {
    // simulate re-render from schemaUpdate
    comp.props.file = fixture.file;
    comp.setState();
    let dom = React.findDOMNode(comp);
    let editLink = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');
    dom = React.findDOMNode(editLink);
    expect(editLink).toBeDefined();
    expect(dom.id).toEqual(`edit-link-${fixture.id}`);
    expect(comp.props.readOnly).toBe(false);
    let e = {nativeEvent: {type: 'click'}};
    comp.handleClick(e);
    expect(e.component).toEqual({
      id: comp.props.id,
      schemaUpdates: {
        file: {},
      }
    });

    // simulate re-render from schemaUpdate
    comp.props.file = e.component.schemaUpdates.file;
    comp.setState();
    let input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');
    let inputInDOM = React.findDOMNode(input);
    expect(inputInDOM).toBeDefined();
    expect(inputInDOM.type).toEqual('file');
  });

});
