const {Server400Error} = require("../../utils");
const {GDBStakeholderOutcomeModel} = require("../../models/stakeholderOutcome");
const {hasAccess} = require("../../helpers/hasAccess");
const {GDBImpactNormsModel} = require("../../models/impactStuffs");
const {Transaction} = require("graphdb-utils");
const {stakeholderOutcomeBuilder} = require("./stakeholderOutcomeBuilder");
const {GDBUserAccountModel} = require("../../models/userAccount");
const {fetchDataTypeInterfaces} = require("../../helpers/fetchHelper");
const {configLevel} = require('../../config');
const {deleteDataAndAllReferees, checkAllReferees} = require("../helpers");

const resource = 'StakeholderOutcome'

const createStakeholderOutcomeHandler = async (req, res, next) => {
  try {
    const {form} = req.body;
    if (await hasAccess(req, 'create' + resource)) {
      await Transaction.beginTransaction();
      if (await stakeholderOutcomeBuilder('interface', null, null, null, {}, {}, form, configLevel)) {
        await Transaction.commit();
        return res.status(200).json({success: true});
      }
    }
  } catch (e) {
    if (Transaction.isActive())
      Transaction.rollback();
    next(e)
  }
}


const fetchStakeholderOutcomesThroughOrganizationHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}s`))
      return await fetchStakeholderOutcomesThroughOrganization(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

const fetchStakeholderOutcomesThroughOrganization = async (req, res) => {
  const {organizationUri} = req.params;
  if (!organizationUri)
    throw new Server400Error('Organization URI is missing')

  let stakeholderOutcomes = []
  const impactNormss = await GDBImpactNormsModel.find({organization: organizationUri}, {populates: ['stakeholderOutcomes']});
  if (!impactNormss.length)
    return res.status(200).json({success: true, stakeholderOutcomes: []})
  for (let impactNorms of impactNormss) {
    if (impactNorms.stakeholderOutcomes)
      stakeholderOutcomes = [...stakeholderOutcomes, ...impactNorms.stakeholderOutcomes]
  }
  const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});

  return res.status(200).json({success: true, stakeholderOutcomes: stakeholderOutcomes || [], editable: userAccount.isSuperuser})
}


const fetchStakeholderOutcomesThroughStakeholderHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}s`))
      return await fetchStakeholderOutcomesThroughStakeholder(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

const updateStakeholderOutcomeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'updateStakeholderOutcome'))
      return await updateStakeholderOutcome(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    // if (Transaction.isActive())
    //   Transaction.rollback();
    next(e);
  }
};

const updateStakeholderOutcome = async (req, res) => {
  const {form} = req.body;
  const {uri} = req.params;
  // await Transaction.beginTransaction();
  form.uri = uri;
  if (await stakeholderOutcomeBuilder('interface', null, null,null, {}, {}, form, configLevel)) {
    // await Transaction.commit();
    return res.status(200).json({success: true});
  }
}

const fetchStakeholderOutcomeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}s`))
      return await fetchStakeholderOutcome(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

const fetchStakeholderOutcomeInterfacesHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetchStakeholderOutcomes'))
      return await fetchDataTypeInterfaces(resource, req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

const fetchStakeholderOutcomeInterfaces = async (req, res) => {
  const {organizationUri} = req.params;
  let stakeholderOutcomes = [];
  if (!organizationUri || organizationUri === 'undefined') {
    stakeholderOutcomes = await GDBStakeholderOutcomeModel.find({})
  } else {
    const impactNorms = await GDBImpactNormsModel.findOne({organization: organizationUri}, {populates: ['stakeholderOutcomes']});
    if (impactNorms) {
      stakeholderOutcomes = impactNorms.stakeholderOutcomes || []
    }
  }

  const stakeholderOutcomeInterfaces = {}
  stakeholderOutcomes.map(
    stakeholderOutcome => {
      stakeholderOutcomeInterfaces[stakeholderOutcome._uri] = stakeholderOutcome.name
    }
  )
  return res.status(200).json({success: true, stakeholderOutcomeInterfaces});
}

const fetchStakeholderOutcome = async (req, res) => {
  const {uri} = req.params;
  if (!uri)
    throw new Server400Error('URI is missing')
  const stakeholderOutcome = await GDBStakeholderOutcomeModel.findOne({_uri: uri}, )
  return res.status(200).json({success: true, stakeholderOutcome})
}


const fetchStakeholderOutcomesThroughStakeholder = async (req, res) => {
  const {stakeholderUri} = req.params;
  if (!stakeholderUri)
    throw new Server400Error('Stakeholder URI is missing')

  const stakeholderOutcomes = await GDBStakeholderOutcomeModel.find({stakeholder: stakeholderUri}, {populates: ['outcome', 'codes', 'impactReports']});
  return res.status(200).json({success: true, stakeholderOutcomes})
}

const deleteStakeholderOutcomeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'deleteStakeholderOutcome'))
      return await deleteStakeholderOutcome(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const deleteStakeholderOutcome = async (req, res) => {
  const {uri} = req.params;
  const {checked} = req.body;
  if (!uri)
    throw new Server400Error('uri is required');

  if (checked) {
    await deleteDataAndAllReferees(uri, 'cids:hasStakeholderOutcome');
    await deleteDataAndAllReferees(uri, 'cids:forOutcome');
    return res.status(200).json({message: 'Successfully deleted the object and all reference', success: true});
  } else {
    const {mandatoryReferee, regularReferee} = await checkAllReferees(uri, {
      'cids:ImpactNorms': 'cids:hasStakeholderOutcome',
      'cids:Outcome': 'cids:hasStakeholderOutcome',
      'cids:ImpactReport': 'cids:forOutcome',
    }, configLevel)
    return res.status(200).json({mandatoryReferee, regularReferee, success: true});
  }
}


module.exports = {createStakeholderOutcomeHandler,
  fetchStakeholderOutcomesThroughStakeholderHandler, fetchStakeholderOutcomeHandler, fetchStakeholderOutcomeInterfacesHandler, fetchStakeholderOutcomesThroughOrganizationHandler, updateStakeholderOutcomeHandler, deleteStakeholderOutcomeHandler
}