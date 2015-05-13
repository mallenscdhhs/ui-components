import React from 'react';
import Flux, { dispatcher as Dispatcher } from 'fluxify';
import constants from '../../src/constants';
import TestUtils from 'react/lib/ReactTestUtils';
import File from '../../src/File';

let fixture = require('../fixtures/file.json');

describe('File', function() {
  let config = {id: 'file-test', name: 'fileTest'};
  let comp = TestUtils.renderIntoDocument(<File {...config}/>);
  comp.setState({files: fixture});
  let ul = React.findDOMNode(comp);
  let previewElements = ul.childNodes[0].childNodes;
  let previewCont = previewElements[0];
  let fileName = previewCont.childNodes[0].childNodes[0];
  let removeLink = previewCont.childNodes[0].childNodes[1];
  let previewImg = TestUtils.scryRenderedDOMComponentsWithTag(previewElements, 'img');

  it('renders a file preview', function() {
      expect(previewCont.className).toEqual('file-preview-list-item row mblg');
      expect(fileName.textContent).toEqual('tiny.gif');
      expect(removeLink.textContent).toEqual('remove');
      expect(previewImg.src).toEqual(fixture.binary);
  });

  it('can facilitate removal of files and update the preview', function(){
    // click the Remove link
    TestUtils.Simulate.click(removeLink);
    let ulFirstChild = ul.childNodes[0];
    expect(ulFirstChild.class).not.toBeDefined();
  });

  it('fires FIELD_VALUE_CHANGE with an array of uploaded files', function(done){
    Dispatcher.register( 'file-upload-change' , function(action, data){
      if( action === constants.actions.FIELD_VALUE_CHANGE &&
          data.id === 'file-test') {
        Dispatcher.unregister('file-upload-change');
        expect(data.value).toEqual(fixture);
        done();
      }
    });
    comp.buildChangeEvent(fixture);
  });
});
