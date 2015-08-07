import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from '../../src/constants';
import TestUtils from 'react/lib/ReactTestUtils';
import File from '../../src/File';

let fixture = require('../fixtures/file.json');
let {
  FIELD_VALUE_CHANGE,
  FILE_PREVIEW_LIST_GET,
  FILE_PREVIEW_LIST_LOAD
} = constants.actions;

describe('File', () => {
  let config = {id: 'file-test', name: 'fileTest', value: fixture};
  let configTwo = {id: 'file-test2', name: 'fileTest2', value: ''};
  let comp = TestUtils.renderIntoDocument(<File {...config}/>);
  let wrapper = React.findDOMNode(comp);
  let ul = wrapper.childNodes[0];
  let uploadField = wrapper.childNodes[1];
  let firstLi = ul.childNodes[0];
  let fileName = firstLi.childNodes[0].childNodes[0];
  let removeLink = firstLi.childNodes[0].childNodes[1];
  let previewImg = TestUtils.scryRenderedDOMComponentsWithTag(firstLi, 'img');

  it('renders a file preview', () => {
      expect(firstLi.className).toEqual('file-preview-list-item row mblg');
      expect(fileName.textContent).toEqual('tiny.gif');
      expect(removeLink.textContent).toEqual('remove');
      expect(previewImg.src).toEqual(fixture.binary);
  });

  it('can configure maximum number of files to be uploaded', () => {
      expect(wrapper.childNodes[1].id).toEqual('file-test');
      // set this.props.limit to 1 (file uploaded earlier will bring us up to max)
      comp.props.limit = 1;
      // re-render with the new limit applied
      comp.setState();
      expect(wrapper.childNodes[1].id).toEqual('limit-message');
  });

  it('can facilitate removal of files and update the preview', () => {
    // click the Remove link
    TestUtils.Simulate.click(removeLink);
    expect(ul.class).not.toBeDefined();
  });

  it('fires FIELD_VALUE_CHANGE with an array of uploaded files', (done) => {
    Dispatcher.register( 'file-upload-change' , (action, data) => {
      if ( action === FIELD_VALUE_CHANGE && data.id === 'file-test') {
        Dispatcher.unregister('file-upload-change');
        expect(data.value).toEqual(fixture);
        done();
      }
    });
    comp.buildChangeEvent(fixture);
  });

  it('will attempt to fetch files via an API if none are supplied in props', (done) => {
    Dispatcher.register('get-file-preview-list', (action, data) => {
      if (action === FILE_PREVIEW_LIST_GET && data.fieldId === configTwo.id) {
        Dispatcher.unregister('get-file-preview-list');
        expect(action).toEqual('getFilePreviewList');
        expect(data.fieldId).toEqual('file-test2');
        done();
      }
    });
    let compTwo = TestUtils.renderIntoDocument(<File {...configTwo}/>);
  });

  it('can load files for preview fetched from an API', (done) => {
    let compTwo = TestUtils.renderIntoDocument(<File {...configTwo}/>);
    expect(compTwo.value).not.toBeDefined();

    Dispatcher.register('load-file-preview-list', (action, data) => {
      if (action === FILE_PREVIEW_LIST_LOAD && data.fieldId === configTwo.id) {
        Dispatcher.unregister('load-file-preview-list');
        expect(compTwo.value).toEqual(fixture.value);
        done();
      }
    });
    // Action called in PE on successful response from FILE_PREVIEW_LIST_GET
    Flux.doAction(FILE_PREVIEW_LIST_LOAD, {fieldId: 'file-test2', value: fixture});
  });
});
