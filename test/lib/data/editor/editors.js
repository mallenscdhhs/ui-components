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
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'type',
        'label': 'Type',
        'helpText': '',
        'required': true,
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
        'options': {}
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'required',
        'label': 'Required',
        'helpText': '',
        'required': false,
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
        'required': false
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'session',
        'label': 'Session Value',
        'helpText': 'Session values will be persisted throughout the application.',
        'required': false,
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
        'required': false
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
        'rows': [ [{'md': '12'}],
          [{'md': '6'}, {'md': '6'}]]
      }
    },
    'components': [ {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'options',
        'label': 'Option Values',
        'helpText': 'A pipe-delimited list of possible field values.',
        'required': false
      }
    },{
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'options-service',
        'label': 'Service',
        'helpText': 'Service at which this field\'s options can be located.',
        'required': false
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'options-dependency',
        'label': 'Depends On',
        'helpText': 'The name of the field whose value will determine this field\'s options.',
        'required': false
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
        'required': false
      }
    }, {
      'type': 'field',
      'config': {
        'type': 'text',
        'name': 'dependency-values',
        'label': 'Values',
        'helpText': 'A pipe-delimited list of values that will trigger this fields visibility.',
        'required': false
      }
    },{
      'type': 'field',
      'config': {
        'type': 'select',
        'name': 'dependency-initial-state',
        'label': 'Initial State',
        'helpText': '',
        'required': false,
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
    'name' : '',
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