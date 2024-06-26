const {assignValue} = require("../helpers");
const {GDBDataSetModel} = require("../../models/dataset");
const {getPrefixedURI} = require('graphdb-utils').SPARQL;
const configs = require("../fileUploading/configs");
async function datasetBuilder(environment, object, organization, error, {
  datasetDict,
  objectDict
}, {
                                       addMessage,
                                       addTrace,
                                       getFullPropertyURI,
                                       getValue,
                                       getListOfValue
                                     }, form, configLevel) {
  let uri = object ? object['@id'] : undefined;
  const mainModel = GDBDataSetModel;
  let hasError = false;
  let ret;
  const mainObject = environment === 'fileUploading' ? datasetDict[uri] : await mainModel.findOne({_uri: form.uri}) || mainModel({}, {uri: form.uri});
  if (environment === 'interface') {
    await mainObject.save();
    uri = mainObject._uri;
  }

  const config = configs[configLevel]['dataset'];
  if (mainObject) {
    // addTrace(`    Loading ${uri} of type ${getPrefixedURI(object['@type'][0])}...`);

    ret = assignValue(environment, config, object, mainModel, mainObject, 'name', 'schema:name', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'identifier', 'schema:identifier', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'description', 'schema:description', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    if (environment === 'interface') {
      form.dateCreated = new Date(form.dateCreated)
    }

    ret = assignValue(environment, config, object, mainModel, mainObject, 'dateCreated', 'schema:dateCreated', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;




    if (environment === 'interface') {
      await mainObject.save();
      return true
    }


    if (hasError) {
      // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
    } else if (environment === 'fileUploading'){
      // addTrace(`    Finished reading ${uri} of type ${getPrefixedURI(object['@type'][0])}...`);
      addMessage(4, 'finishedReading',
        {uri, type: getPrefixedURI(object['@type'][0])}, {});
    }
  } else {
    // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
  }
  return error;

}

module.exports = {datasetBuilder};