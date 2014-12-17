var tu = React.addons.TestUtils;

describe('Editor', function(){

	it('Renders edit modal', function(){
		var fixture = require('../fixtures/editor/default-modal.json');
		var form = require('../fixtures/editor/default-form.json');
		var ec = tu.renderIntoDocument(Components.factory(fixture));
		var modal = tu.scryRenderedDOMComponentsWithClass(ec, 'modal-dialog');
		expect(modal.length).toEqual(1);
	});

	it('Renders remove component list item', function(){
		var fixture = require('../fixtures/editor/default-modal.json');
		var ec = tu.renderIntoDocument(Components.factory(fixture));
		var modal = tu.scryRenderedDOMComponentsWithClass(ec, 'component-subs-list-item');
		expect(modal.length).toEqual(1);
	});

	it('Render full modal with inputs and gathers save component data correctly', function(){
		var EditorConfig = require('../../src/EditorConfig');
		var fixture = require('../fixtures/editor/default-form.json');

		document.body.innerHTML = '<div id="component-page"></div>';

		React.render(Components.factory(fixture),document.getElementById('component-page'));
		expect(document.body.getElementsByClassName('field').length).toEqual(5);

		document.getElementById('text-field-1-id').value        = 'one';
		document.getElementById('password-field-1-id').value    = 'two';
		document.getElementById('text-field-2-id').value        = 'three';
		document.getElementById('date-field-1-id').value        = '12/12/12';
		document.getElementById('email-field-1-id').value       = 'test@test.com';

		var formValues = EditorConfig.getFieldValuesFromForm('test-form-id');

		expect(formValues['text-field-1-id']).toEqual('one');
		expect(formValues['password-field-1-id']).toEqual('two');
		expect(formValues['text-field-2-id']).toEqual('three');
		expect(formValues['date-field-1-id']).toEqual('12/12/12');
		expect(formValues['email-field-1-id']).toEqual('test@test.com');
	});

});