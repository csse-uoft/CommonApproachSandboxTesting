const {baseLevelConfig, fullLevelConfig} = require("../fileUploading/configs");
const {assignValue, assignValues,
  assignMeasure, assignTimeInterval
} = require("../helpers");
const {GDBIndicatorReportModel} = require("../../models/indicatorReport");
const {GDBOrganizationModel} = require("../../models/organization");
const {getPrefixedURI} = require('graphdb-utils').SPARQL;

async function indicatorReportBuilder(environment, object, organization, error, {
  indicatorDict,
  indicatorReportDict,
  objectDict
}, {
                                        addMessage,
                                        addTrace,
                                        getFullPropertyURI,
                                        getValue,
                                        getListOfValue
                                      }, form) {

  let uri = object ? object['@id'] : undefined;
  let hasError = false;
  let ret;
  let ignore;
  const mainModel = GDBIndicatorReportModel;
  const mainObject = environment === 'fileUploading' ? indicatorReportDict[uri] : mainModel({}, {uri: form.uri});
  if (environment !== 'fileUploading') {
    await mainObject.save();
    uri = mainObject._uri;
  }
  const config = fullLevelConfig.indicatorReport;


  if (mainObject) {

    if (environment !== 'fileUploading') {
      organization = await GDBOrganizationModel.findOne({_uri: form.organization});
      // impactNorms = await GDBImpactNormsModel.findOne({organization: form.organization}) || GDBImpactNormsModel({organization: form.organization});
    }

    mainObject.forOrganization = organization._uri;

    // if (!impactNorms.indicatorReports)
    //   impactNorms.indicatorReports = [];
    // impactNorms.indicatorReports = [...impactNorms.indicatorReports, uri];

    // if (environment === 'interface') {
    //   await impactNorms.save();
    // }

    ret = assignValue(environment, config, object, mainModel, mainObject, 'name', 'cids:hasName', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'comment', 'cids:hasComment', addMessage, form, uri, hasError, error);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'datasets', 'dcat:dataset', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignValues(environment, config, object, mainModel, mainObject, 'hasAccesss', 'cids:hasAccess', addMessage, form, uri, hasError, error, getListOfValue);
    hasError = ret.hasError;
    error = ret.error;

    ret = assignMeasure(environment, config, object, mainModel, mainObject, 'value', 'iso21972:value', addMessage, uri, hasError, error, form);
    error = ret.error;
    hasError = ret.hasError;

    ret = assignTimeInterval(environment, config, object, mainModel, mainObject, addMessage, form, uri, hasError, error);
    error = ret.error
    hasError = ret.hasError

    // add indicator to the indicatorReport

    ret = assignValue(environment, config, object, mainModel, mainObject, 'forIndicator', 'cids:forIndicator', addMessage, form, uri, hasError, error);
    error = ret.error;
    hasError = ret.hasError;
    ignore = ret.ignore;

    ret = assignValue(environment, config, object, mainModel, mainObject, 'dateCreated', 'schema:dateCreated', addMessage, form, uri, hasError, error);
    error = ret.error;
    hasError = ret.hasError;
    ignore = ret.ignore;

    if (mainObject.dateCreated) {
      mainObject.dateCreated = new Date(mainObject.dateCreated)
    }

    // add the indicatorReport to indicator if needed
    // if (environment === 'interface' || (!ignore && !indicatorDict[mainObject.forIndicator])) {
    //   // the indicator is not in the file, fetch it from the database and add the indicatorReport to it
    //   const indicatorURI = mainObject.forIndicator;
    //   const indicator = await GDBIndicatorModel.findOne({_uri: indicatorURI});
    //   if (!indicator) {
    //     if (environment === 'fileUploading'){
    //       addTrace('        Error: bad reference');
    //       addTrace(`            Indicator ${indicatorURI} appears neither in the file nor in the sandbox`);
    //       addMessage(8, 'badReference',
    //         {uri, referenceURI: indicatorURI, type: 'Indicator'}, {rejectFile: true});
    //       error += 1;
    //       hasError = true;
    //     } else if (environment === 'interface') {
    //       throw new Server400Error('No such Indicator');
    //     }
    //   } else if (indicator.forOrganization !== organization._uri) {
    //     if (environment === 'fileUploading') {
    //       addTrace('        Error:');
    //       addTrace(`            Indicator ${indicatorURI} doesn't belong to this organization`);
    //       addMessage(8, 'subjectDoesNotBelong',
    //         {uri, type: 'Indicator', subjectURI: indicatorURI}, {rejectFile: true});
    //       error += 1;
    //       hasError = true;
    //     } else if (environment === 'interface'){
    //       throw new Server400Error('The indicator is not under the organization');
    //     }
    //   } else {
    //     if (!indicator.indicatorReports) {
    //       indicator.indicatorReports = [];
    //     }
    //     indicator.indicatorReports = [...indicator.indicatorReports, uri];
    //     await indicator.save();
    //   }
    // }

    // add the timeInterval to indicator report
    // todo: add form to it
    // if (environment === 'fileUploading' && object[getFullPropertyURI(mainModel, 'hasTime')]) {
    //   mainObject.hasTime = getValue(object, mainModel, 'hasTime') ||
    //     GDBDateTimeIntervalModel({
    //       hasBeginning: getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0],
    //           GDBDateTimeIntervalModel, 'hasBeginning') ||
    //         GDBInstant({
    //           date: new Date(getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0]
    //             [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasBeginning')][0], GDBInstant, 'date'))
    //         }, {
    //           uri: getFullObjectURI(
    //             object[getFullPropertyURI(mainModel, 'hasTime')][0]
    //               [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasBeginning')][0]
    //           )
    //         }),
    //
    //       hasEnd: getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0],
    //           GDBDateTimeIntervalModel, 'hasEnd') ||
    //         GDBInstant({
    //           date: new Date(getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0]
    //             [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasEnd')][0], GDBInstant, 'date'))
    //         }, {
    //           uri: getFullObjectURI(
    //             object[getFullPropertyURI(mainModel, 'hasTime')][0]
    //               [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasEnd')][0]
    //           )
    //         })
    //     }, {uri: getFullObjectURI(object[getFullPropertyURI(mainModel, 'hasTime')])})
    // }

    if (environment === 'interface') {
      // if (form.startTime && form.endTime)
      //   mainObject.hasTime =  GDBDateTimeIntervalModel({
      //     hasBeginning: {date: new Date(form.startTime)},
      //     hasEnd: {date: new Date(form.endTime)}
      //   })
      await mainObject.save();
      return true
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

module.exports = {indicatorReportBuilder}