const {createGraphDBModel, Types} = require("graphdb-utils");
const {GDBMeasureModel} = require("./measure");
const {GDBDateTimeIntervalModel} = require("./time");

const GDBCounterfactualModel = createGraphDBModel({
  hasTime: {type: GDBDateTimeIntervalModel, internalKey: 'cids:hasTime'},
  description: {type: String, internalKey: 'schema:description'},
  iso72Value: {type: GDBMeasureModel, internalKey: 'iso21972:value'},
  locatedIns: {type: [() => require('./feature').GDBFeatureModel], internalKey: 'iso21972:located_in'}
}, {
  rdfTypes: ['cids:Counterfactual'], name: 'counterfactual'
});

module.exports = {
  GDBCounterfactualModel
}