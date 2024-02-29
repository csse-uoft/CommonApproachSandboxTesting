const {fullLevelConfig} = require("../fileUploading/configs");
const {GDBOutcomeModel} = require("../../models/outcome");
const {GDBIndicatorModel} = require("../../models/indicator");
const {Server400Error} = require("../../utils");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBImpactNormsModel} = require("../../models/impactStuffs");
const {assignValue, assignValues, assignImpactNorms} = require("../helpers");
const {Transaction} = require("graphdb-utils");

const {getFullURI, getPrefixedURI} = require('graphdb-utils').SPARQL;

async function outcomeBuilder(environment, object, organization, error, {outcomeDict, objectDict, impactNormsDict}, {
  addMessage,
  addTrace,
  getFullPropertyURI,
  getValue,
  getListOfValue
}, form) {
  let uri = object? object['@id'] : undefined;
  let ret;
  const mainModel = GDBOutcomeModel;
  let impactNorms;
  const mainObject = environment === 'fileUploading' ? outcomeDict[uri] : mainModel({
  }, {uri: form.uri});
  if (environment === 'interface') {
    await mainObject.save();
    uri = mainObject._uri;
  }

  if (environment === 'interface') {
    organization = await GDBOrganizationModel.findOne({_uri: form.organization});
    impactNorms = await GDBImpactNormsModel.findOne({_uri: form.partOf, organization: organization._uri})
    if (!impactNorms.outcomes)
      impactNorms.outcomes = [];
    impactNorms.outcomes = [...impactNorms.outcomes, uri]
    await impactNorms.save();
    mainObject.partOf = impactNorms._uri
  }

  mainObject.forOrganization = organization._uri;
  if (!organization.hasOutcomes)
    organization.hasOutcomes = [];
  if (!organization.hasOutcomes.includes(uri)){
    organization.hasOutcomes = [...organization.hasOutcomes, uri]
  }


  if (environment === 'interface') {
    await organization.save();
  }

  const config = fullLevelConfig['outcome'];
  let hasError = false;
  if (mainObject) {

    ret = assignValue(environment, config, object, mainModel, mainObject, 'name', 'cids:hasName', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    if (environment === 'fileUploading')
      ret = await assignImpactNorms(config, object, mainModel, mainObject, 'partOf', 'oep:partOf', addMessage, organization._uri, uri, hasError, error, impactNormsDict, 'outcomes')

    ret = assignValue(environment, config, object, mainModel, mainObject, 'description', 'cids:hasDescription', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'themes', 'cids:forTheme', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'codes', 'cids:hasCode', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'stakeholderOutcomes', 'cids:hasStakeholderOutcome', addMessage, form, uri, hasError, error, getListOfValue)
    hasError = ret.hasError;
    error = ret.error;

    // todo: handle the case when stakeholderOutcomes is in the database


    ret = assignValues(environment, config, object, mainModel, mainObject, 'canProduces', 'cids:canProduce', addMessage, form, uri, hasError, error, getListOfValue)
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'dateCreated', 'schema:dateCreated', addMessage, form, uri, hasError, error)
    hasError = ret.hasError;
    error = ret.error;

    if (mainObject.dateCreated)
      mainObject.dateCreated = new Date(mainObject.dateCreated)

    ret = assignValues(environment, config, object, mainModel, mainObject, 'locatedIns', 'iso21972:located_in', addMessage, form, uri, hasError, error, getListOfValue)
    hasError = ret.hasError;
    error = ret.error;


    // add indicator to outcome
    if (((environment === 'fileUploading' && !object[getFullPropertyURI(mainModel, 'indicators')]) || (environment !== 'fileUploading' && (!form.indicators || !form.indicators.length))) && config['cids:hasIndicator']) {
      if (config['cids:hasIndicator'].rejectFile) {
        if (environment === 'fileUploading') {
          error += 1;
          hasError = true;
        } else {
          throw new Server400Error('Indicators are mandatory');
        }
      }
      if (environment === 'fileUploading')
        addMessage(8, 'propertyMissing',
          {
            uri,
            type: getPrefixedURI(object['@type'][0]),
            property: getPrefixedURI(getFullPropertyURI(mainModel, 'indicators'))
          },
          config['cids:hasIndicator']
        );
    } else if ((object && object[getFullPropertyURI(mainModel, 'indicators')]) || (form.indicators)) {
      if (!mainObject.indicators)
        mainObject.indicators = [];
      for (const indicatorURI of environment === 'fileUploading'? getListOfValue(object, mainModel, 'indicators') : form.indicators) {
        mainObject.indicators = [...mainObject.indicators, indicatorURI]
        // add outcome to indicator
        if (environment !== 'fileUploading' || !objectDict[indicatorURI]) {
          //in this case, the indicator is not in the file, get the indicator from database and add the outcome to it
          const indicator = await GDBIndicatorModel.findOne({_uri: indicatorURI});
          if (!indicator) {
            if (environment === 'fileUploading') {
              addTrace('        Error: bad reference');
              addTrace(`            Indicator ${indicatorURI} appears neither in the file nor in the sandbox`);
              addMessage(8, 'badReference',
                {uri, referenceURI: indicatorURI, type: 'Indicator'}, {rejectFile: true});
              hasError = true;
              error += 1;
            } else {
              throw new Server400Error(`Indicator ${indicatorURI} is not in the database`)
            }

          } else if (indicator.forOrganization !== organization._uri) {
            if (environment === 'fileUploading') {
              addTrace('        Error:');
              addTrace(`            Indicator ${indicatorURI} does not belong to this organization`);
              addMessage(8, 'subjectDoesNotBelong', {
                uri,
                type: 'Indicator',
                subjectURI: indicatorURI
              }, {rejectFile: true});
              error += 1;
              hasError = true;
            } else {
              throw new Server400Error(`Indicator ${indicatorURI} does not belong to this organization`)
            }
          } else {
            if (!indicator.forOutcomes)
              indicator.forOutcomes = [];
            if (!indicator.forOutcomes.includes(uri)) {
              indicator.forOutcomes = [...indicator.forOutcomes, uri]
            }
            await indicator.save();
          }

        } // if the indicator is in the file, don't have to worry about adding the outcome to the indicator
      }
    }
    if (environment === 'interface') {
      await mainObject.save();
      return true
    }
    if (hasError) {
      // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
    } else if (environment === 'fileUploading') {
      addTrace(`    Finished reading ${uri} of type ${getPrefixedURI(object['@type'][0])}...`);
      addMessage(4, 'finishedReading',
        {uri, type: getPrefixedURI(object['@type'][0])}, {});
    }

  } else {
    // addTrace(`Fail to upload ${uri} of type ${getPrefixedURI(object['@type'][0])}`);
  }
  return error;

}

module.exports = {outcomeBuilder};