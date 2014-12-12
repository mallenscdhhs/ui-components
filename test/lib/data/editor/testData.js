var fieldsFixture = {
    'text' : {
        'type' : 'field',
        'config' : {
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
            'type' : 'select',
            'name' : 'test-select',
            'label' : 'Test Select',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':[],
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
            'type' : 'multiselect',
            'name' : 'test-multiselect',
            'label' : 'Test MultiSelect',
            'helpText': 'This is Help Text.',
            'required': false,
            'rules':['BR-123','BSR-4543','BR-45'],
            'dependency': {
                'name':'test-text-1',
                'value':'hi|hello|bye',
                'initialState': 'visable'
            },
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
                    'name': 'test-email'
                }
            },
            'session' : false
        }
    },
    'email' : {
        'type' : 'field',
        'config' : {
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
        'name' : 'Test Form One',
        'model' : {},
        'actions':[{
            'type' : 'link',
            'config' : {
                'name' : 'Test Link Action',
                'url' : 'testURLHTTP',
                'event' : 'next'
            }
        },{
            'type' : 'button',
            'config' : {
                'name' : 'Test Button Action',
                'url' : 'testURLHTTP',
                'event' : 'back'
            }
        }],
        'rules': [],
        'components' :[{
            'type' : 'fieldset',
            'config':{
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
                        'type' : 'password',
                        'name' : 'test-password-231234123',
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
                        'type' : 'text',
                        'name' : 'test-password-23qwerqwer',
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
                        'type' : 'date',
                        'name' : 'test-password-23asdfasdf',
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
                        'type' : 'email',
                        'name' : 'test-password-23retwertwert',
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
