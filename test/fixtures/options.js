import Response from './Response';

export default {
  customField: {
    id: 'customField',
    name: 'test'
  },
  customPayload: [
    {label: 'Foo', value: 1},
    {label: 'Bar', value: 2}
  ],
  fieldWithOptions: {
    id: 'fieldWithOptions',
    name: 'fieldWithOptions',
    type: 'select',
    label: 'Test',
    options: [
      {value: 'test', label: 'test'}
    ]
  },
  fieldWithOptionsResource: {
    id: 'fieldWithOptionsResource',
    name: 'fieldWithOptionsResource',
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
    id: 'dependentField1',
    name: 'dependentField1',
    value: 'foo',
    optionsResource: 'REF_TEST'
  },
  dependentField2: {
    id: 'dependentField2',
    name: 'dependentField2',
    value: 'bar'
  },
  fieldWithDependency: {
    id: 'fieldWithDependency',
    name: 'fieldWithDependency',
    optionsResource: 'RTDTEST',
    optionsDependencyName: ['dependentField1']
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
    id: 'fieldWithMultipleDependencies',
    name: 'fieldWithMultipleDependencies',
    optionsResource: 'RTDTEST',
    optionsDependencyName: ['dependentField1', 'dependentField2']
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
