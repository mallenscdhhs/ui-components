
module.exports = {

    /**
     * Iterate over passed in element, and return a list of field names
     * @param element
     * @returns {Array}
     */
    getFieldNames : function (element) {
        var fieldNames = [];
        if (element.config.components) {
            _.each(element.config.components, function (comp, j) {
                fieldNames = fieldNames.concat(getFieldNames(comp));
            });
        } else {
            fieldNames.push(element.config.name);
        }
        return fieldNames;
    },


    /**
     * Combine EditorForm and Component Data
     * @param form
     * @param data
     * @returns {object}
     */
    mergeFormAndData: function(form,data) {
        _.each(form.config.components, function (fieldSet, i) {
            _.each(fieldSet.config.components, function (conf, i) {
                // set the value of the field.  // TODO make less tricky for objects
                fieldSet.config.components[i].config.value = data.props[conf.config.name];
            });
        });
        return form;
    }

}