const {GDBOrganizationModel} = require("../../models/organization");
const {allReachableOrganizations} = require("../../helpers");
const {GDBUserAccountModel} = require("../../models/userAccount");
const {hasAccess} = require('../../helpers/hasAccess')
const {GDBGroupModel} = require("../../models/group");
const {fetchDataTypeInterfaces} = require("../../helpers/fetchHelper");

const resource = "Organization"

const fetchOrganizationsHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}s`))
      return await fetchOrganizations(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const fetchOrganizationsInterfacesHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, `fetch${resource}sInterfaces`))
      return await fetchDataTypeInterfaces(resource, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const fetchOrganizations = async (req, res) => {
  const {groupUri, orgAdminUri} = req.params
  if (groupUri) {
    // fetch organizations based on groupURI
    const group = await GDBGroupModel.findOne({_uri: groupUri}, {populates: ['organizations']});
    return res.status(200).json({success: true, organizations: group.organizations})
  } else if(orgAdminUri) {
    // fetch all orgs managed by the orgAmin
    const orgs = await GDBOrganizationModel.find({administrator: orgAdminUri});
    return res.status(200).json({success: true, organizations: orgs})
  } else {
    const userAccount = await GDBUserAccountModel.findOne({_uri: req.session._uri});
    // let organizations = [];

    // if the user is the superuser, return all organizations to him
    if (userAccount.isSuperuser) {
      const organizations = await GDBOrganizationModel.find({}, {populates: ['administrator.person']});
      organizations.map(organization => {
        if(organization.administrator) {
          organization.administrator = `${organization.administrator._uri}: ${organization.administrator.person.givenName} ${organization.administrator.person.familyName}`
        } else {
          // organization may doesn't have admin
          organization.administrator = ''
        }
        organization.editable = true;
      })
      return res.status(200).json({success: true, organizations: organizations});
    }

    const organizations = await allReachableOrganizations(userAccount);
    organizations.map(organization => {
      // if the organization is administrated by the user, set it as editable
      if(organization.administrator?._uri === userAccount._uri)
        organization.editable = true;
      organization.administrator = organization.administrator? `${organization.administrator._uri}: ${organization.administrator.person.givenName} ${organization.administrator.person.familyName}`: null
    })

    return res.status(200).json({success: true, organizations: organizations});
  }


};

module.exports = {
  fetchOrganizationsHandler, fetchOrganizationsInterfacesHandler
};