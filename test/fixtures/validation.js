import Response from './Response';

export default {
  field: {
    id: 'test',
    name: 'test',
    value: 'valueTest',
    rules: {
      rule1: true,
      rule2: true
    }
  },
  emptyField: {
    id: 'test',
    name: 'test',
    required: true,
    rules: {
      '/VR_InputRequiredCheck': true
    }
  },
  fieldResponse: new Response({
    module: 'PE',
    operationStatus: 'SUCCESS',
    responsePayload: {
      message: 'Updated Successfully.'
    }
  }),
  failureResponse: new Response({
    module: 'PE',
    operationStatus: 'FAILURE',
    operationMessages: [
      {
        metadata: {
          rule: 'BR_RULE1',
          params: [
            'nameTest'
          ]
        },
        messgeCode: 'ERR_1001',
        description: 'Field is not valid.',
        level: 'INFO',
        autoHide: false
      },
      {
        metadata: {
          rule: 'BR_RULE2',
          params: [
            'nameTest2'
          ]
        },
        messgeCode: 'ERR_1002',
        description: 'Field is not long enough.',
        level: 'INFO',
        autoHide: false
      }
    ]
  }),
  disabledField: {
    id: 'disabledtest',
    name: 'disabledtest',
    value: 'valueTest',
    rules: {
      rule1: true,
      rule2: false
    },
    disabled: true
  },
  hiddenField: {
    id: 'vistest',
    name: 'vistest',
    value: 'valueTest',
    rules: {
      rule1: true,
      rule2: false
    },
    visible: 'hidden'
  }
};
