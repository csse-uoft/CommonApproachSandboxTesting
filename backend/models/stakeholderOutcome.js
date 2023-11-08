const {createGraphDBModel} = require("graphdb-utils");
const {GDBCodeModel} = require("./code");

const GDBStakeholderOutcomeModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  name: {type: String, internalKey: 'cids:hasName'},
  codes : {type: [GDBCodeModel], internalKey: 'cids:hasCode'},
  stakeholder: {type: () => require('./stakeholder').GDBStakeholderModel, internalKey: 'cids:forStakeholder'},
  outcome: {type: () => require('./outcome').GDBOutcomeModel, internalKey: 'cids:forOutcome'},
  importance: {type: String, internalKey: 'cids:hasImportance'},
  isUnderserved: {type: Boolean, internalKey: 'cids:isUnderserved'},
  indicators: {type: [() => require('./indicator').GDBIndicatorModel], internalKey: 'cids:hasIndicator'},
  impactReports: {type: [() => require('./impactReport').GDBImpactReportModel], internalKey: 'cids:hasImpactReport'},
  fromPerspectiveOf: {type: () => require('./stakeholder').GDBStakeholderModel, internalKey: 'cids:fromPerspectiveOf'},
  intendedImpact: {type: String, internalKey: 'cids:intendedImpact'}
},{
  rdfTypes: ['cids:StakeholderOutcome'], name: 'stakeholderOutcome'
})

module.exports = {GDBStakeholderOutcomeModel}