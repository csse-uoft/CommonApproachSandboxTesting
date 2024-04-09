const {assignValue, assignValues, assignInvertValues, assignInvertValue} = require("../helpers");
const {GDBOutcomeModel} = require("../../models/outcome");
const {Server400Error} = require("../../utils");
const {GDBStakeholderOutcomeModel} = require("../../models/stakeholderOutcome");
const {getPrefixedURI} = require('graphdb-utils').SPARQL;
const configs = require("../fileUploading/configs");

async function stakeholderOutcomeBuilder(environment, object, organization, error, {
  outcomeDict,
  stakeholderOutcomeDict,
  objectDict
}, {
                                           addMessage,
                                           addTrace,
                                           getFullPropertyURI,
                                           getValue,
                                           getListOfValue
                                         }, form, configLevel) {

  let uri = object ? object['@id'] : undefined;
  let hasError = false;
  let ret;
  let ignore;
  const mainModel = GDBStakeholderOutcomeModel;
  const mainObject = environment === 'fileUploading' ? stakeholderOutcomeDict[uri] : await mainModel.findOne({_uri: uri}) || mainModel({}, {uri: form.uri});

  if (environment !== 'fileUploading') {
    await mainObject.save();
    uri = mainObject._uri;
  }
  const config = configs[configLevel]['stakeholderOutcome'];


  if (mainObject) {
    if (environment === 'interface') {
      // organization = await GDBOrganizationModel.findOne({_uri: form.organization});
      // impactNorms = await GDBImpactNormsModel.findOne({organization: organization._uri}) || GDBImpactNormsModel({organization});
    }

    // if (!impactNorms.stakeholderOutcomes)
    //   impactNorms.stakeholderOutcomes = [];
    // impactNorms.stakeholderOutcomes = [...impactNorms.stakeholderOutcomes, uri];

    if (environment === 'interface') {
      // await impactNorms.save();
    }

    ret = assignValue(environment, config, object, mainModel, mainObject, 'name', 'cids:hasName', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'description', 'cids:hasDescription', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'isUnderserved', 'cids:isUndererved', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'importance', 'cids:hasImportance', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'stakeholder', 'cids:forStakeholder', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'intendedImpact', 'cids:intendedImpact', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'fromPerspectiveOf', 'cids:fromPerspectiveOf', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'indicators', 'cids:hasIndicator', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'codes', 'cids:hasCode', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'impactReports', 'cids:hasImpactReport', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;
    // todo: add stakeholderOutcome to impactReport if needed

    // ret = assignValue(environment, config, object, mainModel, mainObject, 'outcome', 'cids:forOutcome', addMessage, form, uri, hasError, error);


    // todo: there are error inside here!!!
    ret = assignInvertValue(environment, config, object, mainModel, mainObject, {
        propertyName: 'outcome',
        internalKey: 'cids:forOutcome'
      }, objectDict, organization,
      {
        objectModel: GDBOutcomeModel,
        invertProperty: 'stakeholderOutcomes',
        invertPropertyMultiply: true,
        propertyToOrganization: environment === 'fileUploading'? 'forOrganization' : null,
        objectType: 'Outcome'
      }, addMessage, form, uri, hasError, error, getListOfValue
    );
    hasError = ret.hasError;
    error = ret.error;

    if (mainObject.outcome && (environment === 'interface' || !outcomeDict[mainObject.outcome])) {
      const outcomeURI = mainObject.outcome;
      const outcome = await GDBOutcomeModel.findOne({_uri: outcomeURI});
      if (!outcome) {
        if (environment === 'fileUploading') {
          addTrace('        Error: bad reference');
          addTrace(`            Outcome ${outcomeURI} appears neither in the file nor in the sandbox`);
          addMessage(8, 'badReference',
            {uri, referenceURI: outcomeURI, type: 'Outcome'}, {rejectFile: true});
          error += 1;
          hasError = true;
        } else if (environment === 'interface') {
          throw new Server400Error('No such Outcome');
        }
      } // else if (outcome.forOrganization !== organization._uri) {
        // if (environment === 'fileUploading') {
        //   addTrace('        Error:');
        //   addTrace(`            Outcome ${outcomeURI} doesn't belong to this organization`);
        //   addMessage(8, 'subjectDoesNotBelong',
        //     {uri, type: 'Outcome', subjectURI: outcomeURI}, {rejectFile: true});
        //   error += 1;
        //   hasError = true;
        // } else if (environment === 'interface') {
        //   throw new Server400Error('The indicator is not under the organization');
        // }
      // }
      else {
        if (!outcome.stakeholderOutcomes) {
          outcome.stakeholderOutcomes = [];
        }
        if (!outcome.stakeholderOutcomes.includes(uri)) {
          outcome.stakeholderOutcomes = [...outcome.stakeholderOutcomes, uri];
        }
        await outcome.save();
      }
    }

    if (environment === 'interface') {
      await mainObject.save();
      return true;
    }

    if (!ignore && !hasError && environment === 'fileUploading') {
      addTrace(`    Finished reading ${uri} of type ${getPrefixedURI(object['@type'][0])}...`);
      addMessage(4, 'finishedReading',
        {uri, type: getPrefixedURI(object['@type'][0])}, {});
    }
  } else {
    // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
  }
  return error;

}

module.exports = {stakeholderOutcomeBuilder};