import Response from './Response';

export default {
  customField: {
    id: 'test',
    name: 'test'
  },
  customPayload: [
    {label: 'Foo', value: 1},
    {label: 'Bar', value: 2}
  ],
  fieldWithOptions: {
    id: 'fieldWithOpts',
    name: 'fieldWithOpts',
    type: 'select',
    label: 'Test',
    options: [
      {value: 'test', label: 'test'}
    ]
  },
  fieldWithOptionsResource: {
    id: 'test1',
    name: 'test1',
    optionsResource: 'RTDTEST'
  },
  fieldWithOptionsResourceResponse: new Response({
    operationStatus: 'SUCCESS',
    responsePayload: {
      result: [
        {label: 'One', value: 1},
        {label: 'Two', value: 2},
        {label: 'Three', value: 3}
      ]
    }
  }),
  dependentField1: {
    id: 'field1',
    name: 'field1',
    value: 'foo'
  },
  dependentField2: {
    id: 'field2',
    name: 'field2',
    value: 'bar'
  },
  fieldWithDependency: {
    id: 'test1',
    name: 'test1',
    optionsResource: 'RTDTEST',
    optionsDependencyName: ['field1']
  },
  fieldWithDependencyResponse: new Response({
    operationStatus: 'SUCCESS',
    responsePayload: {
      result: [
        {label: 'One', value: 1}
      ]
    }
  }),
  fieldWithMultipleDependencies: {
    id: 'test1',
    name: 'test1',
    optionsResource: 'RTDTEST',
    optionsDependencyName: ['field1', 'field2']
  },
  fieldWithMultipleDependenciesResponse: new Response({
    operationStatus: 'SUCCESS',
    responsePayload: {
      result: [
        {label: 'One', value: 1},
        {label: 'Two', value: 2}
      ]
    }
  })
};
