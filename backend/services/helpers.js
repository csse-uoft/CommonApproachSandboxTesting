const {Server400Error} = require("../utils");
const {GDBMeasureModel} = require("../models/measure");
const {Transaction} = require("graphdb-utils");
const {GDBImpactNormsModel} = require("../models/impactStuffs");
const {GDBDateTimeIntervalModel, GDBInstant} = require("../models/time");
const {getFullURI, getPrefixedURI} = require('graphdb-utils').SPARQL;
const {UpdateQueryPayload,} = require('graphdb').query;
const {QueryContentType} = require('graphdb').http;
/**
 * return the first URI belongs to the object[property]
 * @param object
 * @param graphdbModel
 * @param property
 * @returns {*}
 */
const getValue = (object, graphdbModel, property) => {
  if (!object)
    return undefined;
  if (object[getFullURI(graphdbModel.schema[property].internalKey)]) {
    return object[getFullURI(graphdbModel.schema[property].internalKey)][0]['@value'];
  } else {
    return undefined;
  }
};

const getFullObjectURI = (object) => {
  return object["@id"];
};

const getObjectValue = (object, graphdbModel, property) => {
  if (object[getFullURI(graphdbModel.schema[property].internalKey)]) {
    return object[getFullURI(graphdbModel.schema[property].internalKey)][0];
  } else {
    return undefined;
  }
};

const getFullTypeURIList = (graphdbModel) => {
  return graphdbModel.schemaOptions.rdfTypes.map(uri => getFullURI(uri));
};

const getFullPropertyURI = (graphdbModel, propertyName) => {
  return getFullURI(graphdbModel.schema[propertyName].internalKey);
};

async function transSave(trans, object) {
  const {query} = await object.getQueries();
  return await trans.update(new UpdateQueryPayload()
    .setQuery(query)
    .setContentType(QueryContentType.SPARQL_UPDATE)
    .setTimeout(5));
}

async function assignImpactNorms(config, object, mainModel, mainObject, propertyName, internalKey, addMessage, organizationUri, uri, hasError, error, impactNormsDict, mainModelType) {
  let ignore;
  if (object && object[getFullPropertyURI(mainModel, propertyName)]) {
    mainObject[propertyName] = getValue(object, mainModel, propertyName)
  }
  if (!mainObject[propertyName]) {
    error += 1;
    addMessage(8, 'propertyMissing',
      {
        uri,
        type: getPrefixedURI(object['@type'][0]),
        property: getPrefixedURI(getFullPropertyURI(mainModel, propertyName))
      },
      config[internalKey]
    )
    ignore = true;
  }
  const impactNormsInDatabase = await GDBImpactNormsModel.findOne({_uri: mainObject[propertyName], organization: organizationUri})
  const impactNormsInFile = impactNormsDict[mainObject[propertyName]];
  if (impactNormsInDatabase) {
    // add the outcome to the impactNorms
    if (!impactNormsInDatabase[mainModelType])
      impactNormsInDatabase[mainModelType] = []
    impactNormsInDatabase[mainModelType] = [...impactNormsInDatabase[mainModelType], uri]
    await impactNormsInDatabase.save();
  }
  if (!impactNormsInDatabase && !impactNormsInFile) {
    error += 1;
    addMessage(8, 'NoSuchImpactNorms',
      {
        uri,
        type: getPrefixedURI(object['@type'][0]),
        property: getPrefixedURI(getFullPropertyURI(mainModel, propertyName)),
        impactNormsURI: mainObject[propertyName]
      },
      config[internalKey]
    )
    ignore = true;
  }

  return {hasError, error, ignore};

}

async function assignTimeInterval(environment, config, object, mainModel, mainObject, addMessage, form, uri, hasError, error) {
  let ignore;
  if (mainObject.hasTime) {
    // todo: bug, looks like timeInstant will not be removed
    const timeInterval = await GDBDateTimeIntervalModel.findOne({_uri: mainObject.hasTime});
    await GDBInstant.findOneAndDelete({_uri: timeInterval.hasBeginning});
    await GDBInstant.findOneAndDelete({_uri: timeInterval.hasEnd});
    await GDBDateTimeIntervalModel.findOneAndDelete({_uri: mainObject.hasTime});
    delete mainObject.hasTime;
  }
  if (environment === 'fileUploading' && object[getFullURI('time:hasTime')]) {
    mainObject.hasTime = getValue(object, mainModel, 'hasTime') ||
      GDBDateTimeIntervalModel({
        hasBeginning: getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0],
            GDBDateTimeIntervalModel, 'hasBeginning') ||
          GDBInstant({
            date: new Date(getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0]
              [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasBeginning')][0], GDBInstant, 'date'))
          }, {
            uri: getFullObjectURI(
              object[getFullPropertyURI(mainModel, 'hasTime')][0]
                [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasBeginning')][0]
            )
          }),

        hasEnd: getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0],
            GDBDateTimeIntervalModel, 'hasEnd') ||
          GDBInstant({
            date: new Date(getValue(object[getFullPropertyURI(mainModel, 'hasTime')][0]
              [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasEnd')][0], GDBInstant, 'date'))
          }, {
            uri: getFullObjectURI(
              object[getFullPropertyURI(mainModel, 'hasTime')][0]
                [getFullPropertyURI(GDBDateTimeIntervalModel, 'hasEnd')][0]
            )
          })
      }, {uri: getFullObjectURI(object[getFullPropertyURI(mainModel, 'hasTime')])})
  }

  if (environment === 'interface') {
    if (form.startTime && form.endTime)
      mainObject.hasTime =  GDBDateTimeIntervalModel({
        hasBeginning: {date: new Date(form.startTime)},
        hasEnd: {date: new Date(form.endTime)}
      })
  }

  if (!mainObject.hasTime && config[getFullURI('time:hasTime')]) {
    if (config['time:hasTime'].rejectFile) {
      if (environment === 'fileUploading') {
        error += 1;
        hasError = true;
      } else if (environment === 'interface') {
        Transaction.rollback();
        throw new Server400Error(`hasTime is mandatory`);
      }
    } else if (config['time:hasTime'].ignoreInstance) {
      if (environment === 'fileUploading') {
        ignore = true;
      }
    }
    if (environment === 'fileUploading')
      addMessage(8, 'propertyMissing',
        {
          uri,
          type: getPrefixedURI(object['@type'][0]),
          property: getPrefixedURI(getFullPropertyURI(mainModel, 'hasTime'))
        },
        config['time:hasTime']
      );
  }
  return {hasError, error, ignore};
}


function assignValue(environment, config, object, mainModel, mainObject, propertyName, internalKey, addMessage, form, uri, hasError, error) {
  let ignore;
  if (mainObject[propertyName]) {
    // if the mode is updating
    mainObject[propertyName] = null;
  }
  if ((object && object[getFullPropertyURI(mainModel, propertyName)]) || form && form[propertyName]) {
    mainObject[propertyName] = environment === 'fileUploading' ? getValue(object, mainModel, propertyName) : form[propertyName];
  }
  if (!mainObject[propertyName] && config[internalKey]) {
    if (config[internalKey].rejectFile) {
      if (environment === 'fileUploading') {
        error += 1;
        hasError = true;
      } else if (environment === 'interface') {
        Transaction.rollback();
        throw new Server400Error(`${propertyName} is mandatory`);
      }
    } else if (config[internalKey].ignoreInstance) {
      if (environment === 'fileUploading') {
        ignore = true;
      }
    }
    if (environment === 'fileUploading')
      addMessage(8, 'propertyMissing',
        {
          uri,
          type: getPrefixedURI(object['@type'][0]),
          property: getPrefixedURI(getFullPropertyURI(mainModel, propertyName))
        },
        config[internalKey]
      );
  }
  return {hasError, error, ignore};
}

function assignValues(environment, config, object, mainModel, mainObject, propertyName, internalKey, addMessage, form, uri, hasError, error, getListOfValue) {
  if (mainObject[propertyName]) {
    // if the mode is updating
    mainObject[propertyName] = [];
  }
  if ((object && object[getFullPropertyURI(mainModel, propertyName)]) || form && form[propertyName]) {
    mainObject[propertyName] = environment === 'fileUploading' ? getListOfValue(object, mainModel, propertyName) : form[propertyName];
  }
  if ((!mainObject[propertyName] || !mainObject[propertyName].length) && config[internalKey]) {
    if (config[internalKey].rejectFile) {
      if (environment === 'fileUploading') {
        error += 1;
        hasError = true;
      } else if (environment === 'interface') {
        throw new Server400Error(`${propertyName} is mandatory`);
      }
    }
    if (environment === 'fileUploading')
      addMessage(8, 'propertyMissing',
        {
          uri,
          type: getPrefixedURI(object['@type'][0]),
          property: getPrefixedURI(getFullPropertyURI(mainModel, propertyName))
        },
        config[internalKey]
      );
  }
  return {hasError, error};
}

async function assignMeasure(environment, config, object, mainModel, mainObject, propertyName, internalKey, addMessage, uri, hasError, error, form) {
  if (mainObject[propertyName]) {
    // if the mode is updating, deleting the previous object
    await GDBMeasureModel.findOneAndDelete({_uri: mainObject[propertyName]});
    delete mainObject[propertyName];
  }
  let measureURI = environment === 'interface' ? null : getValue(object, mainModel, propertyName);
  let measureObject = environment === 'interface' ? null : getObjectValue(object, mainModel, propertyName);

  let numericalValue;
  if (measureObject) {
    numericalValue = getValue(measureObject, GDBMeasureModel, 'numericalValue');
  } else if (environment === 'interface' && form && propertyName) {
    numericalValue = form[propertyName];
  }

  if (!measureURI && !numericalValue && config[internalKey]) {
    if (config[internalKey].rejectFile) {
      if (environment === 'interface') {
        throw new Server400Error(`${propertyName} is Mandatory`);
      } else if (environment === 'fileUploading') {
        error += 1;
        hasError = true;
      }
    }
    if (environment === 'fileUploading')
      addMessage(8, 'propertyMissing',
        {
          uri,
          type: getPrefixedURI(object['@type'][0]),
          property: getPrefixedURI(getFullPropertyURI(mainModel, propertyName))
        },
        config[internalKey]
      );
  } else if (measureURI || numericalValue) {
    mainObject[propertyName] = measureURI ||
      GDBMeasureModel({
          numericalValue
        },
        {uri: measureObject ? measureObject['@id'] : null});
  }
  return {hasError, error};
}



module.exports = {
  transSave,
  getFullPropertyURI,
  getFullTypeURIList,
  getValue,
  getObjectValue,
  assignValue,
  assignValues,
  assignMeasure,
  getFullObjectURI,
  assignImpactNorms,
  assignTimeInterval
};