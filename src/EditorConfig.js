var _ = require('underscore');
var Action = require('./Action');
var Queue = require('./EventQueue');

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
 * Iterate over passed in element, and return a list of field ids
 * @param element
 * @returns {Array}
 */
var getFieldIds =  function (element) {
    var fieldIds = [];
    if (element.config.components) {
        _.each(element.config.components, function (comp, j) {
            fieldIds = fieldIds.concat(getFieldIds(comp));
        });
    } else {
        if(element.type === 'field') {
            fieldIds.push(element.config.id);
        }
    }
    return fieldIds;
};

/**
 * Set field data based on passed in ID
 * Return list of updated values, both old and new
 * @param element
 * @param id
 * @param data
 * @returns {Array}
 */
var setFieldData =  function (element,id,data) {
    var updated = [];
    if (element.config.components) {
        _.each(element.config.components, function (comp, j) {
            updated = updated.concat(setFieldData(comp,id,data));
        });
    } else {
        if(element.type === 'field' && element.config.id === id) {
            var updateStatus = {'old':element.config};
            element.config = data;
            updateStatus.new = element.config;
            updated.push(updateStatus);
        }
    }
    return updated;
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
    var form = document.getElementById(formId);
    var fields = form.getElementsByClassName('field');
    _.each(fields,function(field,i){
        if(field.type === 'checkbox' || field.type === 'radio'){
           if(field.checked === true) {
               fieldValues[field.name] = field.value;
           }
        }else{
            fieldValues[field.name] = field.value;
        }
    });
    return fieldValues;
}

var getComponentsToAddList = function(type){
    var items;
    switch(type){
        case 'page':
            items = [{'label':'Form','value':'form'},{'label':'Container','value':'container'},{'label':'Action','value':'action'}];
            break;
        case 'form':
            items = [{'label':'FieldSet','value':'fieldset'},{'label':'Container','value':'container'},{'label':'Action','value':'action'}];
            break;
        case 'fieldset':
            items = [{'label':'Field','value':'field'},{'label':'Action','value':'action'}];
            break;
        case 'container':
            items = [{'label':'Action','value':'action'}];
            break;
        default:
            items = [{'label':'Form','value':'form'}];
    }
    return items;
}

var createAddConfig = function(form, type){
    form.config.components[0].config.components[0].config.options.items = getComponentsToAddList(type);
    return form;
}

var buildComponentModalConfig = function(componentInfo){
    var config = {
        'type' : 'editorConfig',
        'config':{
            'componentType' : componentInfo.type,
            'subs' : componentInfo.showSubs ? componentInfo.subs : null,
            'actions':[
                {
                    "id": "save-update-modal-button",
                    "name": "Save",
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

var RemoveComponent = React.createClass({

    handleClick: function(){
        Queue.push({'entityEvent':'component:remove:'+this.props.config.name,'data':{'type':this.props.type,'name':this.props.config.name}});
    },

    render: function() {
        return (<span className="glyphicon glyphicon-remove pull-left" onClick={this.handleClick}></span>)
    }

});



module.exports = React.createClass({

    statics: {
        'getFieldNames' : getFieldNames,
        'mergeFormAndData' : mergeFormAndData,
        'getFieldValuesFromForm' : getFieldValuesFromForm,
        'buildComponentModalConfig' : buildComponentModalConfig,
        'createAddConfig' : createAddConfig
    },

    render: function() {
        return (
        <div className="modal fade" id="editComponentModal" ref="editComponentModal" tabindex="-1" role="dialog" aria-labelledby="editComponentModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header"><h4 className="modal-title" id="edit-modal-container-label">{this.props.componentType} Component Editor</h4></div>
                    <div className="modal-body">
                        <div id="edit-modal-container"></div>
                        <div id="edit-modal-subs">
                        {_.map(this.props.subs, function(sub){
                            return <div className="component-subs-list-item"><RemoveComponent {...sub} />{sub.type} - {sub.config.name}</div>;
                        })}
                        </div>
                    </div>
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


