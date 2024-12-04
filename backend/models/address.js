const {createGraphDBModel, Types} = require("graphdb-utils");

const GDBSchemaCountry = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  code: {type: String, internalKey: 'ic:hasISO3166Code'}
}, {rdfTypes: ['schema:Country'], name: 'country'});

const GDBSchemaState = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  code: {type: String, internalKey: 'ic:hasISO3166Code'}
}, {rdfTypes: ['schema:State'], name: 'state'});

const GDBStreetType = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
}, {rdfTypes: ['ic:StreetType'], name: 'streetType'});

const GDBStreetDirection = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  code: {type: String, internalKey: 'ic:hasISO3166Code'}
}, {rdfTypes: ['ic:StreetDirection'], name: 'streetDirection'});

const GDBCity = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
}, {rdfTypes: ['schema:City'], name: 'city'});


const GDBAddressModel = createGraphDBModel({
  lat: {type: String, internalKey: 'geo:lat'},
  lng: {type: String, internalKey: 'geo:long'},

  // iContact Ontology defines the type as nonNegativeNumber,
  // but this should be a string since some unit numbers are not just pure number.
  unitNumber: {type: String, internalKey: 'ic:hasUnitNumber'},

  streetNumber: {type: String, internalKey: 'ic:hasStreetNumber'},
  streetName: {type: String, internalKey: 'ic:hasStreet'},
  streetType: {type: GDBStreetType, internalKey: 'ic:hasStreetType'},
  streetDirection: {type: GDBStreetDirection, internalKey: 'ic:hasStreetDirection'},

  city: {type: GDBCity, internalKey: 'ic:hasCity'},
  citySection: {type: String, internalKey: 'ic:hasCitySection'},
  country: {type: GDBSchemaCountry, internalKey: 'ic:hasCountry'},
  state: {type: GDBSchemaState, internalKey: 'ic:hasState'},
  postalCode: {type: String, internalKey: 'ic:hasPostalCode'},

}, {
  rdfTypes: ['ic:Address'], name: 'address'
});

module.exports = {
  GDBAddressModel, GDBSchemaCountry, GDBSchemaState, GDBStreetDirection, GDBStreetType, GDBCity
}