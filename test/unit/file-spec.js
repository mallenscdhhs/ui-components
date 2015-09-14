import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from '../../src/constants';
import TestUtils from 'react/lib/ReactTestUtils';
import File from '../../src/File';

let fixture = require('../fixtures/file.json');
let {
  FIELD_VALUE_CHANGE,
  FILE_PREVIEW_LIST_GET,
  FILE_PREVIEW_LIST_LOAD,
  FILE_PREVIEW_LIST_SEND,
  FILE_PREVIEW_LIST_REMOVE
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

  it('fires FIELD_VALUE_CHANGE with an array of uploaded files and attempts to persist via API', (done) => {
    let fvcEvent = [
      {
        "name": "tiny2.png",
        "size": 101,
        "lastModified": 1431441313001,
        "lastModifiedDate": "Date 2015-05-12T14:35:13.000Z",
        "type": "image/png",
        "binary": ""
      },
      {
        "name": "tiny3.jpg",
        "size": 1101,
        "lastModified": 1431441313002,
        "lastModifiedDate": "Date 2015-05-12T14:35:13.000Z",
        "type": "image/jpg",
        "binary": ""
      }
    ];
    Dispatcher.register('file-upload-change' , (action, data) => {
      if ( action === FIELD_VALUE_CHANGE && data.id === 'file-test') {
        Dispatcher.unregister('file-upload-change');
        expect(data.value).toEqual(fvcEvent);
      }
    });
    Dispatcher.register('send-file-preview-list', (action, data) => {
      if (action === FILE_PREVIEW_LIST_SEND) {
        Dispatcher.unregister('send-file-preview-list');
        expect(action).toEqual('sendFilePreviewList');
        done();
      }
    });
    comp.buildChangeEvent(fvcEvent);
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

  it('will not allow field value changes or API operations to occur if readOnly is true', () => {
    let removalFVCEvent = {id: 'remove-link', type: 'link', name: 'remove', className: 'text-left', fileId: undefined, removalId: 0, dataParent: 'file-test', event: 'removeFilePreviewList', componentType: 'action'};

    spyOn(Flux, 'doAction');
    comp.props.readOnly = true;
    // re-render with readOnly applied
    comp.setState();
    // click the Remove link
    TestUtils.Simulate.click(removeLink);
    expect(ul.class).not.toBeDefined();
    expect(Flux.doAction).not.toHaveBeenCalledWith('removeFilePreviewList', removalFVCEvent);
    //reset readOnly to default for other tests
    comp.props.readOnly = false;
    // re-render with readOnly applied
    comp.setState();
  });

  it('can facilitate removal of files, update the preview, and attempt to persist removal via API', (done) => {
    Dispatcher.register('remove-file-preview-list', (action, data) => {
      if (action === FILE_PREVIEW_LIST_REMOVE) {
        Dispatcher.unregister('remove-file-preview-list');
        expect(action).toEqual('removeFilePreviewList');
        done();
      }
    });

    // click the Remove link
    TestUtils.Simulate.click(removeLink);
    expect(ul.class).not.toBeDefined();
  });

});
