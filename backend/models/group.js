const {createGraphDBModel, Types} = require("graphdb-utils");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBOrganizationModel} = require("./organization");

const GDBGroupModel = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  comment: {type: String, internalKey: 'rdfs:comment'},
  administrator: {type: GDBUserAccountModel, internalKey: ':hasAdministrator'},
  organizations: {type: [GDBOrganizationModel], internalKey: ':hasOrganization'},
}, {
  rdfTypes: [':Group'], name: 'group'
});

module.exports = {
  GDBGroupModel
}