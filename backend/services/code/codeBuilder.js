const {Server400Error} = require("../../utils");
const {GDBCodeModel} = require("../../models/code");
const {getPrefixedURI} = require('graphdb-utils').SPARQL;
const {assignValue, assignMeasure} = require("../helpers");
const configs = require("../fileUploading/configs");
async function codeBuilder(environment, object, organization, error, {codeDict}, {
  addMessage,
  addTrace,
  getFullPropertyURI,
  getValue,
  getListOfValue
}, form, configLevel) {
  let uri = object ? object['@id'] : undefined;
  const mainModel = GDBCodeModel;
  let ret;
  const mainObject = environment === 'fileUploading' ? codeDict[uri] : (form?.uri? (await mainModel.findOne({_uri: form.uri}) || mainModel({}, {uri: form.uri})) : mainModel({}));
  if (environment !== 'fileUploading') {
    await mainObject.save();
    uri = mainObject._uri;
  }

  const config = configs[configLevel]['code'];
  let hasError = false;
  if (mainObject) {

    if (organization || form?.definedBy) {
      mainObject.definedBy = organization?._uri || form.definedBy;
    }
    if (!mainObject.definedBy && config["cids:definedBy"]) {
      if (config["cids:definedBy"].rejectFile) {
        if (environment === 'fileUploading') {
          error += 1;
          hasError = true;
        } else {
          throw new Server400Error('DefinedBy is Mandatory');
        }
      }
      if (environment === 'fileUploading')
        addMessage(8, 'propertyMissing',
          {
            uri,
            type: getPrefixedURI(object['@type'][0]),
            property: getPrefixedURI(getFullPropertyURI(mainModel, 'definedBy'))
          },
          config["cids:definedBy"]
        );
    }

    ret = assignValue(environment, config, object, mainModel, mainObject, 'name', 'cids:hasName', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'description', 'cids:hasDescription', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'identifier', 'tove_org:hasIdentifier', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'specification', 'cids:hasSpecification', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'codeValue', 'schema:codeValue', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = await assignMeasure(environment, config, object, mainModel, mainObject, 'iso72Value', 'iso21972:value', addMessage, uri, hasError, error, form);
    hasError = ret.hasError;
    error = ret.error;

    if (environment === 'interface') {
      await mainObject.save();
      return true
    }
    if (hasError) {
      // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
    } else if (environment === 'fileUploading') {
      // addTrace(`    Finished reading ${uri} of type ${getPrefixedURI(object['@type'][0])}...`);
      addMessage(4, 'finishedReading',
        {uri, type: getPrefixedURI(object['@type'][0])}, {});
    }

  } else {
    // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
  }
  return error;

}

module.exports = {codeBuilder};