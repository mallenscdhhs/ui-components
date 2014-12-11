var _ = require('underscore');
var Action = require('./Action');

/**
 * Iterate over passed in element, and return a list of field names
 * @param element
 * @returns {Array}
 */
 var getFieldNames =  function (element) {
    var fieldNames = [];
    if (element.config.components) {
        _.each(element.config.components, function (comp, j) {
            fieldNames = fieldNames.concat(getFieldNames(comp));
        });
    } else {
        if(element.type === 'field') {
            fieldNames.push(element.config.name);
        }
    }
    return fieldNames;
};

/**
 * Pull Dependency Data
 * @param data
 * @param config
 * @returns {*}
 */
var extractDependency = function(data,config){
    var value;
    switch(config.name){
        case 'dependency-initial-state':
            value = data.initialState;
            break;
        case 'dependency-values':
            value = data.value;
            break;
        default:
            value = data.name;
    }
    return value;
}

/**
 * Pull Options Data
 * @param data
 * @param config
 * @returns {*}
 */
var extractOptions = function(data,config){
    var value;
    if(config.name === 'options-service'){
        value = data.url ? data.url : '';
    }else if(config.name === 'options-dependency'){
        value = data.dependency && data.dependency.name ? data.dependency.name : '';
    }
    return value;
}

/**
 * Pull data from Edit Config for merging with actual form, for default values
 * @param data
 * @param config
 * @returns {*}
 */
var extractData = function(data,config){
    var value;

    switch(config.name){
        case 'dependency-initial-state':
        case 'dependency-values':
        case 'dependency-field':
            value = !!data.props.dependency ? extractDependency(data.props.dependency,config) : '';
            break;
        case 'options-dependency':
        case 'options-service':
            value = !!data.props.options ? extractOptions(data.props.options,config) : '';
            break;
        default:
            value = data.props[config.name];
    }

    return value;
}

/**
 * Combine EditorForm and Component Data
 * @param form
 * @param data
 * @returns {object}
 */
var mergeFormAndData = function(form,data) {
    _.each(form.config.components, function (fieldSet, i) {
        _.each(fieldSet.config.components, function (conf, i) {
            // set the value of the field
            fieldSet.config.components[i].config.value = extractData(data,conf.config);
        });
    });
    return form;
};

/**
 * Return object of field value names
 * @param formId
 * @returns {Array}
 */
var getFieldValuesFromForm = function(formId){
    var fieldValues = {};
    var fields = document.getElementById(formId).getElementsByClassName('field');
    _.each(fields,function(field,i){
        fieldValues[field.name] = field.value;
        if(field.type === 'checkbox' || field.type === 'radio'){
            fieldValues[field.name] = 'checked';
        }
    });
    return fieldValues;
}

var buildComponentModalConfig = function(componentInfo){
    var config = {
        'type' : 'editorConfig',
        'config':{
            'componentType' : componentInfo.type,
            'actions':[
                {
                    "id": "save-update-modal-button",
                    "name": "Update",
                    "type": "button",
                    "classNames": ["btn-primary pull-right"],
                    "event":          componentInfo.event,
                    "componentType" : componentInfo.type,
                    "componentName" : componentInfo.name,
                    "formId"        : componentInfo.formId
                }
            ]
        }
    }
    return config;
}

module.exports = React.createClass({

    statics: {
        'getFieldNames' : getFieldNames,
        'mergeFormAndData' : mergeFormAndData,
        'getFieldValuesFromForm' : getFieldValuesFromForm,
        'buildComponentModalConfig' : buildComponentModalConfig
    },

    render: function() {
        return (
        <div className="modal fade" id="editComponentModal" ref="editComponentModal" tabindex="-1" role="dialog" aria-labelledby="editComponentModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header"><h4 className="modal-title" id="edit-modal-container-label">{this.props.componentType} Component Editor</h4></div>
                    <div className="modal-body" id="edit-modal-container"></div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                        {_.map(this.props.actions, function(action){
                          return <Action {...action}/>;
                        })}
                    </div>
                </div>
            </div>
        </div>
        );
    }
});


