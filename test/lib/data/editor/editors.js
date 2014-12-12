var fieldBasic = {
  'type': 'fieldset',
  'config': {
    'name': '',
    'layout': {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '6'}, {'md': '6'}],
          [{'md': '6'}, {'md': '6'}],
          [{'md': '6'}, {'md': '6'}],
          [{'md': '12'}]]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'name',
        'label': 'Name',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'type',
        'label': 'Type',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options': {
          'items': [
            {'label': 'Text', 'value': 'text'},
            {'label': 'Textarea', 'value': 'textarea'},
            {'label': 'Select', 'value': 'select'},
            {'label': 'Multiselect', 'value': 'multiselect'},
            {'label': 'Radio', 'value': 'radio'},
            {'label': 'Checkbox', 'value': 'checkbox'},
            {'label': 'Password', 'value': 'password'},
            {'label': 'Email', 'value': 'email'},
            {'label': 'Phone', 'value': 'tel'},
            {'label': 'Number', 'value': 'number'},
            {'label': 'Date', 'value': 'date'},
            {'label': 'Time', 'value': 'time'}
          ]
        }
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'label',
        'label': 'Label',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'required',
        'label': 'Required',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options': {
          'items': [
            {'label': 'Yes', 'value': 'true'},
            {'label': 'No', 'value': 'false'}
          ]
        }
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'helpText',
        'label': 'Help Text',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'session',
        'label': 'Session Value',
        'helpText': 'Session values will be persisted throughout the application.',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options': {
          'items': [
            {'label': 'Yes', 'value': 'true'},
            {'label': 'No', 'value': 'false'}
          ]
        }
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'rules',
        'label': 'Business Rules',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }]
  }
};

var fieldOptions = {
  'type': 'fieldset',
  'config': {
    'name': 'Options',
    'layout': {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '6'}, {'md': '6'}]]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'options-service',
        'label': 'Service',
        'helpText': 'Service at which this field\'s options can be located.',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'options-dependency',
        'label': 'Depends On',
        'helpText': 'The name of the field whose value will determine this field\'s options.',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }]
  }
};

var fieldDependency = {
  'type': 'fieldset',
  'config': {
    'name': 'Dependency',
    'layout': {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '6'}, {'md': '6'}],
          [{'md': '6'}] ]
      }
    },
    'components': [ {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'dependency-field',
        'label': 'Depends On',
        'helpText': 'The name of the field whose value determines this field\'s visibility.',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'dependency-values',
        'label': 'Values',
        'helpText': 'A pipe-delimited list of values that will trigger this fields visibility.',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    },{
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'dependency-initial-state',
        'label': 'Initial State',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options': {
          'items': [
            {'label': 'Hidden', 'value': 'hidden'},
            {'label': 'Visable', 'value': 'visable'}
          ]
        }
      }
    }]
  }
};

var fieldForm = {
  'type':'form',
  'config' :{
    'name' : 'field-edit-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}],
                  [{'md': '12'}],
                  [{'md': '12'}] ]
      }
    },
    'components' :[fieldBasic,fieldOptions,fieldDependency]
  }
};

var fieldSetBasic = {
  'type'  : 'fieldset',
  'config': {
    'name'      : '',
    'layout'    : {
      'type'  : "grid",
      'config': {
        'rows': [[{'md': '12'}]]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'name',
        'label': 'Name',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : {}
      }
    }]
  }
}

var fieldSetForm = {
  'type':'form',
  'config' :{
    'name' : 'fieldset-edit-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}] ]
      }
    },
    'components' :[fieldSetBasic]
  }
};

var actionBasic = {
  'type': 'fieldset',
  'config': {
    'name': '',
    'layout': {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '6'}, {'md': '6'}],
                  [{'md': '6'}, {'md': '6'}],
                  [{'md': '6'} ] ]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'name',
        'label': 'Name',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'type',
        'label': 'Type',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options': {
          'items': [
            {'label': 'Button', 'value': 'button'},
            {'label': 'Link', 'value': 'link'}
          ]
        }
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'id',
        'label': 'Id',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'event',
        'label': 'Event',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options': null
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'classNames',
        'label': 'Class Names',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    }]
  }
};

var actionForm = {
  'type':'form',
  'config' :{
    'name' : 'action-edit-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}],
                  [{'md': '12'}],
                  [{'md': '12'}] ]
      }
    },
    'components' :[actionBasic]
  }
};

var containerBasic = {
  'type'  : 'fieldset',
  'config': {
    'name'      : '',
    'layout'    : {
      'type'  : "grid",
      'config': {
        'rows': [[{'md': '12'}]]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'classes',
        'label': 'Class Names',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    }]
  }
}

var containerForm = {
  'type':'form',
  'config' :{
    'name' : 'container-edit-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}] ]
      }
    },
    'components' :[containerBasic]
  }
};

var formBasic = {
  'type'  : 'fieldset',
  'config': {
    'name'      : '',
    'layout'    : {
      'type'  : "grid",
      'config': {
        'rows': [[{'md': '12'}]]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'name',
        'label': 'Name',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    }]
  }
}

var formForm = {
  'type':'form',
  'config' :{
    'name' : 'form-edit-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}] ]
      }
    },
    'components' :[formBasic]
  }
};

var pageBasic = {
  'type'  : 'fieldset',
  'config': {
    'name'      : '',
    'layout'    : {
      'type'  : "grid",
      'config': {
        'rows': [ [{'md' : '12'}],
                  [{'md' : '12'}] ]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'title',
        'label': 'title',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    },{
      'type': 'field',
      'config': {
        'type': 'textarea',
        'name': 'content',
        'label': 'Content',
        'helpText': '',
        'required': false,
        'rules':'',
        'dependency' : null,
        'options' : null
      }
    }]
  }
}

var pageForm = {
  'type':'form',
  'config' :{
    'name' : 'page-edit-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}],
          [{'md': '12'}],
          [{'md': '12'}] ]
      }
    },
    'components' :[pageBasic]
  }
};

var addBasic = {
  'type'  : 'fieldset',
  'config': {
    'name'      : '',
    'layout'    : {
      'type'  : "grid",
      'config': {
        'rows': [ [{'md' : '12'}] ]
      }
    },
    'components': [{
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'type',
        'label': 'Add New Component',
        'helpText': '',
        'required': true,
        'rules':'',
        'dependency' : null,
        'options': {
          'items': []
        }
      }
    }]
  }
}

var addForm = {
  'type':'form',
  'config' :{
    'name' : 'add-component-form',
    'model' : {},
    'actions':[],
    'rules': [],
    'layout' : {
      'type': "grid",
      'config': {
        'rows': [ [{'md': '12'}] ]
      }
    },
    'components' :[addBasic]
  }
};