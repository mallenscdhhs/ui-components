var fieldsFixture = {
    'text' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-text-1',
            'type' : 'text',
            'name' : 'test-text-1',
            'label' : 'Test Text',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'dependency' : null,
            'options' : null,
            'session' : false
        }
    },
    'textarea' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-textarea',
            'type' : 'textarea',
            'name' : 'test-textarea',
            'label' : 'Test Textarea',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'dependency' : null,
            'options' : null,
            'session' : false
        }
    },
    'checkbox' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-checkbox',
            'type' : 'checkbox',
            'name' : 'test-checkbox',
            'label' : 'Test Checkbox',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'value': '1',
            'dependency' : null,
            'options' : {
                'items' : [
                    {
                        'label' : 'Checkbox 1',
                        'value' : '1'
                    }
                ]
            },
            'session' : false
        }
    },
    'radio' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-radio',
            'type' : 'radio',
            'name' : 'test-radio',
            'label' : 'Test Radio',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'value' : '2',
            'dependency' : null,
            'options' : {
                'items' : [
                    {
                        'label' : 'Radio 1',
                        'value' : '1'
                    },
                    {
                        'label' : 'Radio 2',
                        'value' : '2'
                    }
                ]
            },
            'session' : false
        }
    },
    'select' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-select',
            'type' : 'select',
            'name' : 'test-select',
            'label' : 'Test Select',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'value' : '4',
            'dependency' : null,
            'options' : {
                'items' : [
                    {
                        'label' : 'Select 1',
                        'value' : '1'
                    },
                    {
                        'label' : 'Select 2',
                        'value' : '2'
                    }
                ]
            },
            'session' : false
        }
    },
    'multiselect' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-multiselect',
            'type' : 'multiselect',
            'name' : 'test-multiselect',
            'label' : 'Test MultiSelect',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':['BR-123','BSR-4543','BR-45'],
            'dependency': {
                'id':'test-text-1',
                'value':'hi|hello|bye',
                'initialState': 'visable'
            },
            'value': ['4'],
            'options' : {
                'items' : [
                    {
                        'label' : 'MultiSelect 1',
                        'value' : '1'
                    },
                    {
                        'label' : 'MultiSelect 2',
                        'value' : '2'
                    }
                ],
                'url' : 'testURL',
                'resource' : 'Vendor',
                'dependency' : {
                    'id': 'test-email'
                }
            },
            'session' : false
        }
    },
    'email' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-email',
            'type' : 'email',
            'name' : 'test-email',
            'label' : 'Test Email',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'dependency' : null,
            'options' : null,
            'session' : false
        }
    },
    'phone' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-phone',
            'type' : 'phone',
            'name' : 'test-phone',
            'label' : 'Test Phone',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'dependency' : null,
            'options' : null,
            'session' : false
        }
    },
    'date' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-date',
            'type' : 'date',
            'name' : 'test-date',
            'label' : 'Test Date',
            'helpText': 'This is Help Text.',
            'required': true,
            'rules':[],
            'dependency' : null,
            'options' : null,
            'session' : false
        }
    },
    'password' : {
        'type' : 'field',
        'config' : {
            'id' : 'test-password',
            'type' : 'password',
            'name' : 'test-password',
            'label' : 'Test Password',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
            'dependency' : null,
            'options' : null,
            'session' : false
        }
    }
};

var fieldsetFixture = {
    'type' : 'fieldset',
    'config':{
        'id' : 'fieldset-test-3',
        'name' : 'Test Fieldset With All Fields TEST TEST',
        'components' :[],
        'layout' : {
            'type': "grid",
            'config': {
                'rows': [
                    [{'md': '3'},{'md': '3'},{'md': '3'}],
                    [{'md': '3'},{'md': '3'}],
                    [{'md': '3'},{'md': '3'},{'md': '3'}],
                    [{'md': '3'},{'md': '3'}]
                ]
            }
        }
    }
};

// Add fields to components
Object.keys(fieldsFixture).forEach(function(key,j){
    fieldsetFixture.config.components.push(fieldsFixture[key]);
});

var formFixture = {
    'type':'form',
    'config' :{
        'id' : 'test-form-one',
        'name' : 'Test Form One',
        'model' : {},
        'actions':[{
            'type' : 'link',
            'config' : {
                'id' : 'action-1',
                'name' : 'Test Link Action',
                'url' : 'testURLHTTP',
                'event' : 'next'
            }
        },{
            'type' : 'button',
            'config' : {
                'id' : 'action-2',
                'name' : 'Test Button Action',
                'url' : 'testURLHTTP',
                'event' : 'back'
            }
        }],
        'rules': [],
        'components' :[{
            'type' : 'fieldset',
            'config':{
                'id' : 'fieldset-7',
                'name' : 'First Fieldset',
                'layout' : {
                    'type': "grid",
                    'config': {
                        'rows': [[{'md': '3'},{'md': '3'}],
                                 [{'md': '3'}],
                                 [{'md': '3'},{'md': '3'}]]
                    }
                },
                'components' :[{
                    'type' :'field',
                    'config' : {
                        'id' : 'test-text-2',
                        'type' : 'text',
                        'value' : 'test value here folks!',
                        'name' : 'test-text-2',
                        'label' : 'Test Text Field One',
                        'helpText': 'This is Help Text.',
                        'required': false,
                        'rules':['BR-123','BR-324','BST-234'],
                        'dependency' : null,
                        'options' : null,
                        'session' : false
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'id' : 'test-password-3',
                        'type' : 'password',
                        'name' : 'test-password-3',
                        'label' : 'Test Password One',
                        'helpText': 'This is Help Text.',
                        'required': false,
                        'rules':[],
                        'dependency' : null,
                        'options' : null,
                        'session' : false
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'id' : 'test-text-7',
                        'type' : 'text',
                        'name' : 'test-text-7',
                        'label' : 'Test Text Two',
                        'helpText': 'This is Help Text.',
                        'required': false,
                        'rules':[],
                        'dependency' : null,
                        'options' : null,
                        'session' : false
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'id' : 'test-text-8',
                        'type' : 'date',
                        'name' : 'test-text-8',
                        'label' : 'Test Date Three',
                        'helpText': 'This is Help Text.',
                        'required': false,
                        'rules':[],
                        'dependency' : null,
                        'options' : null,
                        'session' : false
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'id' : 'test-email-4',
                        'type' : 'email',
                        'name' : 'test-email-4',
                        'label' : 'Test Email Four',
                        'helpText': 'This is Help Text.',
                        'required': false,
                        'rules':[],
                        'dependency' : null,
                        'options' : null,
                        'session' : false
                    }
                }]
            }
        }]
    }
};


formFixture.config.components.push(fieldsetFixture);
