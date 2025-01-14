const {hasAccess} = require("../../helpers/hasAccess");
const {Server400Error} = require("../../utils");
const {GDBIndicatorModel} = require("../../models/indicator");
const {GDBIndicatorReportModel} = require("../../models/indicatorReport");
const {GDBOrganizationModel} = require("../../models/organization");
const {GDBDateTimeIntervalModel} = require("../../models/time");
const {GDBMeasureModel} = require("../../models/measure");
const {GDBUserAccountModel} = require("../../models/userAccount");
const {indicatorReportBuilder} = require("./indicatorReportBuilder");
const {Transaction} = require("graphdb-utils");
const {fetchDataTypeInterfaces} = require("../../helpers/fetchHelper");
const {configLevel} = require('../../config');
const {deleteDataAndAllReferees, checkAllReferees} = require("../helpers");

const resource = 'IndicatorReport';

const fetchIndicatorReportInterfacesHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetch' + resource + 's'))
      return await fetchDataTypeInterfaces(resource, req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

// const fetchIndicatorReportInterfaces = async (req, res) => {
//   const {organizationUri} = req.params;
//   let indicatorReports;
//   if (organizationUri === 'undefined' || !organizationUri) {
//     // return all indicator Interfaces
//     indicatorReports = await GDBIndicatorReportModel.find({});
//   } else {
//     // return outcomes based on their organization
//     indicatorReports = await GDBIndicatorReportModel.find({forOrganization: organizationUri});
//   }
//
//   const indicatorReportInterfaces = {};
//   indicatorReports.map(indicatorReport => {
//     indicatorReportInterfaces[indicatorReport._uri] = indicatorReport.name || indicatorReport._uri;
//   });
//   return res.status(200).json({success: true, indicatorReportInterfaces});
//
// };

const createIndicatorReportHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'create' + resource)) {
      const {form} = req.body;
      form.value = form.numericalValue;
      form.forIndicator = form.indicator;
      await Transaction.beginTransaction();
      if (await indicatorReportBuilder('interface', null, null, null, {}, {}, form, configLevel))
        await Transaction.commit();
      return res.status(200).json({success: true});
    }
    return res.status(400).json({success: false, message: 'Wrong auth'});
  } catch (e) {
    if (Transaction.isActive())
      Transaction.rollback();
    next(e);
  }
};

const createIndicatorReport = async (req, res) => {
  const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});
  if (!userAccount)
    throw new Server400Error('Wrong auth');
  const {form} = req.body;
  if (form?.indicatorName) { // handle the case when no such indicator name
    const indicator = await GDBIndicatorModel.findOne({name: form.indicatorName});
    if (!indicator)
      return res.status(200).json({success: false, message: 'Wrong indicatorName'});
    form.indicator = indicator._uri;
  }
  if (!form || !form.name || !form.organization || !form.indicator
    || !form.numericalValue || !form.startTime || !form.endTime || !form.dateCreated)
    throw new Server400Error('Wrong input');

  const organization = await GDBOrganizationModel.findOne({_uri: form.organization});
  if (!organization)
    throw new Server400Error('No such organization');
  const indicator = await GDBIndicatorModel.findOne({_uri: form.indicator});
  if (!indicator)
    throw new Server400Error('No such indicator');
  if (await GDBIndicatorReportModel.findOne({
    forOrganization: form.organization,
    name: form.name
  })) {
    return res.status(200).json({success: false, message: `${form.name}: The Indicator Report name is occupied`});
  }
  if (form.startTime > form.endTime)
    throw new Server400Error('Start time must be earlier than end time');

  const indicatorReport = GDBIndicatorReportModel({
    name: form.name,
    comment: form.comment,
    forOrganization: organization,
    forIndicator: indicator,
    hasTime: GDBDateTimeIntervalModel({
      hasBeginning: {date: new Date(form.startTime)},
      hasEnd: {date: new Date(form.endTime)}
    }),
    dateCreated: new Date(form.dateCreated),
    value: GDBMeasureModel({numericalValue: form.numericalValue}),
  }, form.uri ? {uri: form.uri} : null);


  await indicatorReport.save();
  if (!indicator.indicatorReports)
    indicator.indicatorReports = [];
  indicator.indicatorReports.push(indicatorReport);
  await indicator.save();
  // const ownership = GDBOwnershipModel({
  //   resource: indicatorReport,
  //   owner: userAccount,
  //   dateOfCreated: new Date(),
  // });
  // await ownership.save();
  return res.status(200).json({success: true});

};

const fetchIndicatorReportHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetch' + resource))
      return await fetchIndicatorReport(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});
  } catch (e) {
    next(e);
  }
};

const fetchIndicatorReport = async (req, res) => {
  const {uri} = req.params;
  if (!uri)
    throw new Server400Error('Wrong input');
  const indicatorReport = await GDBIndicatorReportModel.findOne({_uri: uri},
    {populates: ['hasTime.hasBeginning', 'hasTime.hasEnd', 'value', 'forIndicator.unitOfMeasure', 'forOrganization', 'unitOfMeasure']});
  if (!indicatorReport)
    throw new Server400Error('No such indicator Report');

  const form = {
    name: indicatorReport.name,
    comment: indicatorReport.comment,
    organization: indicatorReport.forOrganization?._uri,
    indicator: indicatorReport.forIndicator?._uri,
    numericalValue: indicatorReport.value?.numericalValue,
    startTime: indicatorReport.hasTime?.hasBeginning.date,
    endTime: indicatorReport.hasTime?.hasEnd.date,
    dateCreated: indicatorReport.dateCreated,
    uri: indicatorReport._uri,
    datasets: indicatorReport.datasets,
    unitOfMeasure: indicatorReport.unitOfMeasure?.label,
    indicatorName: indicatorReport.forIndicator?.name,
    organizationName: indicatorReport.forOrganization?.legalName,
    hasAccesss: indicatorReport.hasAccesss
  };
  return res.status(200).json({indicatorReport: form, success: true});
};

const updateIndicatorReportHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'updateIndicatorReport'))
      return await updateIndicatorReport(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    // if (Transaction.isActive())
    //   Transaction.rollback();
    next(e);
  }
};

const updateIndicatorReport = async (req, res) => {
  const {form} = req.body;
  const {uri} = req.params;
  // await Transaction.beginTransaction();
  form.uri = uri;
  if (await indicatorReportBuilder('interface', null, null,null, {}, {}, form, configLevel)) {
    // await Transaction.commit();
    return res.status(200).json({success: true});
  }
  // const {form} = req.body;
  // const {uri} = req.params;
  // if (!uri || !form || !form.name || !form.comment || !form.organization || !form.indicator
  //   || !form.numericalValue || !form.startTime || !form.endTime || !form.dateCreated)
  //   throw new Server400Error('Wrong input');
  //
  // const indicatorReport = await GDBIndicatorReportModel.findOne({_uri: uri},
  //   {populates: ['hasTime.hasBeginning', 'hasTime.hasEnd', 'value']});
  // if (!indicatorReport)
  //   throw new Server400Error('No such Indicator Report');
  //
  // indicatorReport.name = form.name;
  // indicatorReport.comment = form.comment;
  //
  // // update organization and indicator
  // if (indicatorReport.forOrganization !== form.organization) {
  //   const organization = await GDBOrganizationModel.findOne({_uri: form.organization});
  //   if (!organization)
  //     throw new Server400Error('No such organization');
  //   indicatorReport.forOrganization = organization;
  // }
  // if (indicatorReport.forIndicator !== form.indicator) {
  //   const indicator = await GDBIndicatorModel.findOne({_uri: form.indicator});
  //   if (!indicator)
  //     throw new Server400Error('No such indicator');
  //   // todo: romove the indicator report from previous indicator and add the indicator report to new indicator
  //   indicatorReport.forIndicator = await GDBIndicatorModel.findOne({_uri: indicatorReport.forIndicator});
  //   const index = indicatorReport.forIndicator.indicatorReports.indexOf(uri);
  //   indicatorReport.forIndicator.indicatorReports.splice(index, 1);
  //   if (!indicator.indicatorReports)
  //     indicator.indicatorReports = [];
  //   indicator.indicatorReports.push(uri);
  //   await indicatorReport.forIndicator.save();
  //   await indicator.save();
  //   indicatorReport.forIndicator = indicator;
  //
  // }
  //
  // if (form.startTime > form.endTime)
  //   throw new Server400Error('Start time must be earlier than end time');
  // indicatorReport.hasTime.hasBeginning.date = new Date(form.startTime);
  // indicatorReport.hasTime.hasEnd.date = new Date(form.endTime);
  // indicatorReport.dateCreated = new Date(form.dateCreated);
  //
  // indicatorReport.value.numericalValue = form.numericalValue;
  //
  // await indicatorReport.save();
  // return res.status(200).json({success: true});
};

const fetchIndicatorReportsHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetch' + resource + 's'))
      return await fetchIndicatorReports(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});
  } catch (e) {
    next(e);
  }
};

const fetchIndicatorReports = async (req, res) => {
  const {orgUri, indicatorUri} = req.params;
  const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});
  let editable;
  let indicatorReports;
  if (!userAccount)
    throw new Server400Error('Wrong Account Information');
  if (indicatorUri) {
    const indicator = await GDBIndicatorModel.findOne({_uri: indicatorUri}, {populates: ['indicatorReports.hasTime.hasEnd', 'indicatorReports.hasTime.hasBeginning', 'indicatorReports.value']});
    if (!indicator)
      throw new Server400Error('No Such Indicator');
    //todo: didn't check access
    indicatorReports = indicator.indicatorReports || [];
  } else if (orgUri) {
    const organization = await GDBOrganizationModel.findOne({_uri: orgUri});
    if (!organization)
      throw new Server400Error('No such organization');
    if (userAccount.isSuperuser || organization.editors?.includes(req.session._uri)) {
      editable = true; // to tell the frontend that the outcome belong to the organization is editable
    }
    indicatorReports = await GDBIndicatorReportModel.find({forOrganization: orgUri},
      {populates: ['value', 'hasTime.hasEnd', 'hasTime.hasBeginning', 'forIndicator.unitOfMeasure']}
    );
  } else {
    if (userAccount.isSuperuser) {
      indicatorReports = await GDBIndicatorReportModel.find({},
        {populates: ['value', 'hasTime.hasEnd', 'hasTime.hasBeginning', 'forIndicator.unitOfMeasure']});
    }

  }


  return res.status(200).json({success: true, indicatorReports, editable});
};

const deleteIndicatorReportHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'deleteIndicatorReport'))
      return await deleteIndicatorReport(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const deleteIndicatorReport = async (req, res) => {
  const {uri} = req.params;
  const {checked} = req.body;
  if (!uri)
    throw new Server400Error('uri is required');

  if (checked) {
    await deleteDataAndAllReferees(uri, 'cids:hasIndicatorReport');
    return res.status(200).json({message: 'Successfully deleted the object and all reference', success: true});
  } else {
    const {mandatoryReferee, regularReferee} = await checkAllReferees(uri, {
      'cids:ImpactNorms': 'cids:hasIndicatorReport',
      'cids:Indicator': 'cids:hasIndicatorReport',
    }, configLevel)
    return res.status(200).json({mandatoryReferee, regularReferee, success: true});
  }
}

module.exports = {
  createIndicatorReportHandler,
  fetchIndicatorReportHandler,
  updateIndicatorReportHandler,
  fetchIndicatorReportsHandler,
  fetchIndicatorReportInterfacesHandler,
  deleteIndicatorReportHandler
};