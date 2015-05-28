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
  let wrapper = React.findDOMNode(comp);
  let ul = wrapper.childNodes[0];
  let uploadField = wrapper.childNodes[1];
  let firstLi = ul.childNodes[0];
  let fileName = firstLi.childNodes[0].childNodes[0];
  let removeLink = firstLi.childNodes[0].childNodes[1];
  let previewImg = TestUtils.scryRenderedDOMComponentsWithTag(firstLi, 'img');

  it('renders a file preview', function() {
      expect(firstLi.className).toEqual('file-preview-list-item row mblg');
      expect(fileName.textContent).toEqual('tiny.gif');
      expect(removeLink.textContent).toEqual('remove');
      expect(previewImg.src).toEqual(fixture.binary);
  });

  it('can configure maximum number of files to be uploaded', function() {
      expect(wrapper.childNodes[1].id).toEqual('file-test');
      // set this.props.limit to 1 (file uploaded earlier will bring us up to max)
      comp.props.limit = 1;
      // re-render with the new limit applied
      comp.setState();
      expect(wrapper.childNodes[1].id).toEqual('limit-message');
  });

  it('can facilitate removal of files and update the preview', function(){
    // click the Remove link
    TestUtils.Simulate.click(removeLink);
    expect(ul.class).not.toBeDefined();
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
