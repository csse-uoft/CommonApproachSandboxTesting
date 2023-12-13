const {GDBOrganizationModel} = require("../../models/organization");
const {hasAccess} = require("../../helpers/hasAccess");
const {Server400Error} = require("../../utils");
const {GDBOutcomeModel} = require("../../models/outcome");
const {GDBOwnershipModel} = require("../../models/ownership");
const {GDBUserAccountModel} = require("../../models/userAccount");
const {GDBIndicatorModel} = require("../../models/indicator");
const {allReachableOrganizations, addObjectToList} = require("../../helpers");
const {outcomeBuilder} = require("./outcomeBuilder");
const {getRepository} = require("../../loaders/graphDB");
const {transSave} = require("../helpers");
const {Transaction} = require("graphdb-utils");
const {fetchDataTypeInterfaces} = require("../../helpers/fetchHelper");

const resource = 'Outcome'


const fetchOutcomes = async (req, res) => {

  const {organizationUri} = req.params;
  if (!organizationUri || organizationUri === 'all') {
    // the organizationId is not given, return all outcomes which is reachable by the user
    const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});
    if (userAccount.isSuperuser) {
      // simple return all indicators to him
      const outcomes = await GDBOutcomeModel.find({},
        {populates: ['indicators.unitOfMeasure', 'indicators.indicatorReports.value', 'indicators.indicatorReports.hasTime.hasBeginning', 'indicators.indicatorReports.hasTime.hasEnd', 'themes']});
      outcomes.map(outcome => outcome.editable = true);
      return res.status(200).json({success: true, outcomes, editable: true});
    }
    // take all reachable organizations
    const reachableOrganizations = await allReachableOrganizations(userAccount);
    const outcomeURIs = [];
    // fetch all available indicatorURIs from reachableOrganizations
    reachableOrganizations.map(organization => {
      if (organization.hasOutcomes)
        organization.hasOutcomes.map(outcomeURI => {
          addObjectToList(outcomeURIs, outcomeURI);
        });
    });
    // replace indicatorURIs to actual indicator objects
    const outcomes = await Promise.all(outcomeURIs.map(outcomeURI => {
      return GDBOutcomeModel.findOne({_uri: outcomeURI});
    }));
    return res.status(200).json({success: true, outcomes});
  } else {
    // the organizationId is given, return all outcomes belongs to the organization
    const organization = await GDBOrganizationModel.findOne({_uri: organizationUri},
      {
        populates: ['hasOutcomes.indicators.unitOfMeasure', 'hasOutcomes.indicators.indicatorReports.value',
          'hasOutcomes.indicators.indicatorReports.hasTime.hasBeginning', 'hasOutcomes.indicators.indicatorReports.hasTime.hasEnd', 'hasOutcomes.themes']
      });
    if (!organization)
      throw new Server400Error('No such organization');
    let editable;
    if (organization.editors?.includes(req.session._uri) || req.session.isSuperuser) {
      editable = true; // to tell the frontend that the outcome belong to the organization is editable
      organization.hasOutcomes?.map(outcome => outcome.editable = true);
    }
    if (!organization.hasOutcomes)
      return res.status(200).json({success: true, outcomes: [], editable});

    return res.status(200).json({success: true, outcomes: organization.hasOutcomes, editable});
  }


};

const fetchOutcomesHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}s`))
      return await fetchOutcomes(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

const fetchOutcomesThroughThemeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetchOutcomesThroughTheme'))
      return await fetchOutcomesThroughTheme(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});
  } catch (e) {
    next(e);
  }
};

const fetchOutcomeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}`))
      return await fetchOutcome(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

const fetchOutcomeInterfaceHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}s`))
      return await fetchDataTypeInterfaces(resource, req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});

  } catch (e) {
    next(e);
  }
};

async function fetchOutcomeInterface(req, res) {
  const {organizationUri} = req.params;
  let outcomes;
  if (organizationUri === 'undefined' || !organizationUri) {
    // return all outcome Interfaces
    outcomes = await GDBOutcomeModel.find({});
  } else {
    // return outcomes based on their organization
    outcomes = await GDBOutcomeModel.find({forOrganization: organizationUri});
  }

  const outcomeInterfaces = {};
  outcomes.map(outcome => {
    outcomeInterfaces[outcome._uri] = outcome.name;
  });
  return res.status(200).json({success: true, outcomeInterfaces});

}

const fetchOutcomesThroughTheme = async (req, res) => {
  const {themeUri} = req.params;
  if (!themeUri)
    throw new Server400Error('Theme URI is not given');
  const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});
  const reachableOrganizations = (await allReachableOrganizations(userAccount)).map(organization => organization._uri);
  let outcomes = await GDBOutcomeModel.find({forOrganization: {$in: reachableOrganizations}},
    {
      populates: ['indicators.unitOfMeasure', 'indicators.indicatorReports.value',
        'indicators.indicatorReports.hasTime.hasBeginning', 'indicators.indicatorReports.hasTime.hasEnd']
    });
  outcomes = outcomes.filter(outcome => outcome.themes?.includes(themeUri));
  return res.status(200).json({success: true, outcomes});
};

const fetchOutcome = async (req, res) => {
  const {uri} = req.params;
  if (!uri)
    throw new Server400Error('URI is not given');
  const outcome = await GDBOutcomeModel.findOne({_uri: uri}, {populates: ['themes', 'indicators']});
  if (!outcome)
    throw new Server400Error('No such outcome');
  outcome.forOrganization = await GDBOrganizationModel.findOne({_uri: outcome.forOrganization});
  outcome.organization = outcome.forOrganization?._uri;
  outcome.organizationName = outcome.forOrganization?.legalName;
  if (!outcome.themes)
    outcome.themes = [];
  outcome.themeNames = {};
  outcome.themes?.map(theme => {
    outcome.themeNames[theme._uri] = theme.name;
  });
  outcome.themes = outcome.themes?.map(theme => theme._uri);

  outcome.indicatorNames = {};
  outcome.indicators?.map(indicator => {
    outcome.indicatorNames[indicator._uri] = indicator.name;
  });
  outcome.indicators = outcome.indicators?.map(indicator => indicator._uri);
  // outcome.forOrganizations = await Promise.all(outcome.forOrganizations.map(orgURI => {
  //   return GDBOrganizationModel.findOne({_id: orgURI.split('_')[1]});
  // }));
  // outcome.organizations = outcome.forOrganizations.map(organization => {
  //   return organization._id;
  // });
  // indicator.forOrganizations.map(organization => {
  //   indicator.organizations[organization._id] = organization.legalName;
  // })
  // outcome.indicator = outcome.indicator.split('_')[1];

  // outcome.identifier = outcome.hasIdentifier;
  delete outcome.forOrganization;
  return res.status(200).json({success: true, outcome});

};

const createOutcomeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'createOutcome')) {
      const {form} = req.body;
      await Transaction.beginTransaction();
      if (await outcomeBuilder('interface', null, null, null, {}, {}, form)){
        await Transaction.commit();
        return res.status(200).json({success: true});
      }
    }
    return res.status(400).json({success: false, message: 'Wrong auth'});
  } catch (e) {
    await Transaction.rollback();
    next(e);
  }
};

function cacheObject(obj, objDict) {
  if (!objDict[obj._uri])
    objDict[obj._uri] = obj;
}

function cacheListOfObjects(objs, objDict) {
  objs.map(obj => {
    cacheObject(obj, objDict);
  });
}

const updateOutcome = async (req, res) => {
  const {form} = req.body;
  const {uri} = req.params;
  if (!uri)
    throw new Server400Error('Id is needed');
  if (!form || !form.description || !form.name || !form.organization || !form.indicators || !form.indicators.length)
    throw new Server400Error('Invalid input');
  // if (await GDBOutcomeModel.findOne({hasIdentifier: form.identifier}))
  //   throw new Server400Error('Duplicated identifier');
  const outcome = await GDBOutcomeModel.findOne({_uri: uri});
  if (!outcome)
    throw new Server400Error('No such outcome');
  outcome.name = form.name;
  outcome.description = form.description;
  outcome.themes = form.themes || [];
  const organizationDict = {};
  const indicatorDict = {};

  // fetch outcome.forOrganizations from database
  // outcome.forOrganizations = await Promise.all(outcome.forOrganizations.map(organizationURI =>
  //   GDBOrganizationModel.findOne({_id: organizationURI.split('_')[1]})
  // ));
  outcome.forOrganization = await GDBOrganizationModel.findOne({_uri: outcome.forOrganization});
  outcome.indicators = await Promise.all(outcome.indicators.map(indicatorURI =>
    GDBIndicatorModel.findOne({_uri: indicatorURI})
  ));
  // outcome.indicator = await GDBIndicatorModel.findOne({_id: outcome.indicator.split('_')[1]});
  // cache outcome.forOrganizations into dict
  // cacheListOfOrganizations(outcome.forOrganizations, organizationDict);
  cacheObject(outcome.forOrganization, organizationDict);
  cacheListOfObjects(outcome.indicators, indicatorDict);
  // cacheObject(outcome.indicator, indicatorDict);
  // fetch form.organizations from database
  form.organization = organizationDict[form.organization] || await GDBOrganizationModel.findOne({_uri: form.organization});
  form.indicator = indicatorDict[form.indicator] || await GDBIndicatorModel.findOne({_uri: form.indicator});
  form.indicators = await Promise.all(form.indicators.map(indicatorUri => {
    // if indicator already in the dict, simply return it
    return indicatorDict[indicatorUri] || GDBIndicatorModel.findOne({_uri: indicatorUri});
  }));
  // form.organizations = await Promise.all(form.organizations.map(organizationId => {
  //     // if the organization already in the dict, simply get from dict
  //     if (organizationDict[organizationId])
  //       return organizationDict[organizationId];
  //     // otherwise, fetch
  //     return GDBOrganizationModel.findOne({_id: organizationId});
  //   }
  // ));

  // cache organizations which is not in dict
  cacheObject(form.organization, organizationDict);
  cacheListOfObjects(form.indicators, indicatorDict);
  // cacheObject(form.indicator, indicatorDict);
  // cacheListOfOrganizations(form.organizations, organizationDict);

  if (form.organization._uri !== outcome.forOrganization._uri) {
    // remove the outcome from outcome.organization
    const index = outcome.forOrganization.hasOutcomes.findIndex(outcome => outcome._uri === uri);
    outcome.forOrganization.hasOutcomes.splice(index, 1);
    await outcome.forOrganization.save();

    // add the outcome to form.organization
    if (!form.organization.hasOutcomes)
      form.organization.hasOutcomes = [];
    form.organization.hasOutcomes.push(outcome);
    await form.organization.save();
    outcome.forOrganization = form.organization;
  }

  // if (form.indicator._id !== outcome.indicator._id) {
  //   const index = outcome.indicator.forOutcomes.findIndex(outcome => outcome._id === id);
  //   outcome.indicator.forOutcomes.splice(index, 1);
  //   await outcome.indicator.save();
  //
  //   if (!form.indicator.forOutcomes)
  //     form.indicator.forOutcomes = [];
  //   form.indicator.forOutcomes.push(outcome);
  //   await form.indicator.save();
  //   outcome.indicator = form.indicator;
  // }
  // remove the outcome from every indicators in outcome.indicators
  await Promise.all(outcome.indicators.map(indicator => {
    const index = indicator.forOutcomes.findIndex(outcome => outcome._uri === uri);
    indicator.forOutcomes.splice(index, 1);
    return indicator.save();
  }));

  // add the outcome to every indicators in form.indicators
  await Promise.all(form.indicators.map(indicator => {
    if (!indicator.forOutcomes)
      indicator.forOutcomes = [];
    indicator.forOutcomes.push(outcome);
    return indicator.save();
  }));

  outcome.indicators = form.indicators;
  // outcome.hasIdentifier = form.identifier;

  // remove the outcome from every organizations in outcome.forOrganizations
  // await Promise.all(outcome.forOrganizations.map(organization => {
  //   const index = organization.hasOutcomes.findIndex(outcome => outcome._id === id);
  //   organization.hasOutcomes.splice(index, 1);
  //   return organization.save();
  // }));

  // add the outcome to every organizations in form.organizations
  // await Promise.all(form.organizations.map(organization => {
  //   if (!organization.hasOutcomes)
  //     organization.hasOutcomes = [];
  //   organization.hasOutcomes.push(outcome);
  //   return organization.save();
  // }));

  await outcome.save();
  return res.status(200).json({success: true});
};

const updateOutcomeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'updateOutcome'))
      return await updateOutcome(req, res);
    return res.status(400).json({success: false, message: 'Wrong auth'});
  } catch (e) {
    next(e);
  }
};

const createOutcome = async (req, res) => {
  const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});
  if (!userAccount)
    throw new Server400Error('Wrong auth');
  const {form} = req.body;
  if (!form || !form.organization || !form.name || !form.description || !form.indicators || !form.indicators.length)
    throw new Server400Error('Invalid input');
  // if (await GDBOutcomeModel.findOne({hasIdentifier: form.identifier}))
  //   throw new Server400Error('Duplicated identifier');
  // form.hasIdentifier = form.identifier;
  form.forOrganization = await GDBOrganizationModel.findOne({_uri: form.organization}, {populates: ['hasOutcomes']});
  // form.forOrganizations = await Promise.all(form.organizations.map(organizationId =>
  //   GDBOrganizationModel.findOne({_id: organizationId}, {populates: ['hasOutcomes']})
  // ));

  // for each organization, does it contain any outcome with same name?
  let duplicate = false;
  let organizationInProblem;
  if (form.forOrganization.hasOutcomes) {
    form.forOrganization.hasOutcomes.map(outcome => {
      if (outcome.name === form.name) {
        duplicate = true;
        organizationInProblem = form.organization._uri;
      }
    });
  }
  // add indicator to the outcome, notice that the indicator must belong to the organization

  form.indicators = await Promise.all(form.indicators.map(indicatorUri =>
    GDBIndicatorModel.findOne({_uri: indicatorUri}, {populates: ['forOutcomes']})
  ));
  if (form.indicators.includes(undefined) || form.indicators.includes(null))
    throw new Server400Error('Wrong indicator(s)');
  form.indicators.map(indicator => {
    if (!indicator.forOrganizations.includes(form.forOrganization._uri))
      throw new Server400Error('The indicator is not belong to the organization');
  });

  // const indicator = await GDBIndicatorModel.findOne({_id: form.indicator}, {populates: ['forOutcomes']});
  // if (!indicator)
  //   throw new Server400Error('No such indicator');
  // if (!indicator.forOrganizations.includes(`:organization_${form.organization}`))
  //   throw new Server400Error('The indicator is not belong to the organization');
  // form.indicator = indicator;
  // form.forOrganizations.map(organization => {
  //   if(organization.hasOutcomes){
  //     organization.hasOutcomes.map(outcome => {
  //       if (outcome.name === form.name) {
  //         duplicate = true;
  //         organizationInProblem = organization._id;
  //       }
  //     });
  //   }
  // })
  if (duplicate && organizationInProblem)
    return res.status(200).json({
      success: false,
      message: 'The name of the outcome has been occupied in organization ' + organizationInProblem
    });

  const outcome = GDBOutcomeModel({
    name: form.name,
    description: form.description,
    forOrganization: form.forOrganization,
    indicators: form.indicators,
    themes: form.themes || []
  });
  await outcome.save();
  // add the outcome to the organizations
  if (!outcome.forOrganization.hasOutcomes)
    outcome.forOrganization.hasOutcomes = [];
  outcome.forOrganization.hasOutcomes.push(outcome);
  await outcome.forOrganization.save();
  // add the outcome to indicators
  await Promise.all(outcome.indicators.map(indicator => {
    if (!indicator.forOutcomes)
      indicator.forOutcomes = [];
    indicator.forOutcomes.push(outcome);
    return indicator.save();
  }));
  // if (!outcome.indicator.forOutcomes)
  //   outcome.indicator.forOutcomes = [];
  // outcome.indicator.forOutcomes.push(outcome);
  // await outcome.indicator.save();

  // await Promise.all(outcome.forOrganizations.map(organization => {
  //   if (!organization.hasOutcomes)
  //     organization.hasOutcomes = [];
  //   organization.hasOutcomes.push(outcome);
  //   return organization.save();
  // }));
  // const ownership = GDBOwnershipModel({
  //   resource: outcome,
  //   owner: userAccount,
  //   dateOfCreated: new Date(),
  // });
  // await ownership.save();
  return res.status(200).json({success: true});
};


module.exports = {
  updateOutcomeHandler,
  createOutcomeHandler,
  fetchOutcomesHandler,
  fetchOutcomeHandler,
  fetchOutcomesThroughThemeHandler,
  fetchOutcomeInterfaceHandler
};