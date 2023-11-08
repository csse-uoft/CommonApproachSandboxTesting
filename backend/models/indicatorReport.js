const {createGraphDBModel, Types} = require("graphdb-utils");
const {GDBDateTimeIntervalModel} = require("./time");
const {GDBMeasureModel} = require("./measure");
const {GDBOwnershipModel} = require("./ownership");

const GDBIndicatorReportModel = createGraphDBModel({
  name: {type: String, internalKey: 'cids:hasName'},
  comment: {type: String, internalKey: 'cids:hasComment'},
  forOrganization: {type: () => require('./organization').GDBOrganizationModel, internalKey: 'cids:forOrganization'},
  forIndicator: {type: () => require('./indicator').GDBIndicatorModel, internalKey: 'cids:forIndicator'},
  dateCreated: {type: Date, internalKey: 'schema:dateCreated'},
  hasTime: {type: GDBDateTimeIntervalModel, internalKey: 'time:hasTime'},
  value: {type: GDBMeasureModel, internalKey: 'iso21972:value'},
  hasAccess: {type: () => require('./organization').GDBOrganizationModel, internalKey: 'cids:hasAccess'},
  datasets: {type: [() => require('./dataset').GDBDataSetModel], internalKey: 'dcat:dataset'}
}, {
  rdfTypes: ['cids:IndicatorReport'], name: 'indicatorReport'
});

module.exports = {
  GDBIndicatorReportModel
}