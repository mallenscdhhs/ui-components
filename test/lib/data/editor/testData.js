var fieldsFixture = {
    'text' : {
        'type' : 'field',
        'config' : {
            type : 'text',
            name : 'test-text-1',
            label : 'Test Text',
            helpText: 'This is Help Text.'
        }
    },
    'textarea' : {
        'type' : 'field',
        'config' : {
            type : 'textarea',
            name : 'test-textarea',
            label : 'Test Textarea'
        }
    },
    'checkbox' : {
        'type' : 'field',
        'config' : {
            type : 'checkbox',
            name : 'test-checkbox',
            label : 'Test Checkbox',
            options : {
                'items' : [
                    {
                        'label' : 'Checkbox 1',
                        'value' : '1'
                    },
                    {
                        'label' : 'Checkbox 2',
                        'value' : '2'
                    }
                ]
            }
        }
    },
    'radio' : {
        'type' : 'field',
        'config' : {
            type : 'radio',
            name : 'test-radio',
            label : 'Test Radio',
            options : {
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
            }
        }
    },
    'select' : {
        'type' : 'field',
        'config' : {
            type : 'select',
            name : 'test-select',
            label : 'Test Select',
            options : {
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
            }
        }
    },
    'multiselect' : {
        'type' : 'field',
        'config' : {
            type : 'multiselect',
            name : 'test-multiselect',
            label : 'Test MultiSelect',
            dependency: {
                'name':'test-text-1',
                'value':'hi|hello|bye',
                'initialState': 'hidden'
            },
            options : {
                'items' : [
                    {
                        'label' : 'MultiSelect 1',
                        'value' : '1'
                    },
                    {
                        'label' : 'MultiSelect 2',
                        'value' : '2'
                    }
                ]
            }
        }
    },
    'email' : {
        'type' : 'field',
        'config' : {
            type : 'email',
            name : 'test-email',
            label : 'Test Email'
        }
    },
    'phone' : {
        'type' : 'field',
        'config' : {
            type : 'phone',
            name : 'test-phone',
            label : 'Test Phone'
        }
    },
    'date' : {
        'type' : 'field',
        'config' : {
            type : 'date',
            name : 'test-date',
            label : 'Test Date',
            required : true
        }
    },
    'password' : {
        'type' : 'field',
        'config' : {
            type : 'password',
            name : 'test-password',
            label : 'Test Password'
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
                        'label' : 'Test Text Field One'
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'type' : 'password',
                        'name' : 'test-password-231234123',
                        'label' : 'Test Password One'
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'type' : 'text',
                        'name' : 'test-password-23qwerqwer',
                        'label' : 'Test Text Two'
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'type' : 'date',
                        'name' : 'test-password-23asdfasdf',
                        'label' : 'Test Date Three'
                    }
                },{
                    'type' : 'field',
                    'config' : {
                        'type' : 'email',
                        'name' : 'test-password-23retwertwert',
                        'label' : 'Test Email Four'
                    }
                }]
            }
        }]
    }
};


formFixture.config.components.push(fieldsetFixture);
