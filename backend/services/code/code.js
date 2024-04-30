const {hasAccess} = require("../../helpers/hasAccess");
const {Server400Error} = require("../../utils");
const {GDBCodeModel} = require("../../models/code");
const {codeBuilder} = require("./codeBuilder");
const {Transaction} = require("graphdb-utils");
const {deleteDataAndAllReferees, checkAllReferees} = require("../helpers");

const fetchCodeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetchCode'))
      return await fetchCode(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const fetchCode = async (req, res) => {
  const {uri} = req.params;
  if (!uri)
    throw Server400Error('A code is needed');
  const code = await GDBCodeModel.findOne({_uri: uri}, {populates: ['iso72Value']});
  if (!code)
    throw Server400Error('No such code');
  code.iso72Value = code.iso72Value.numericalValue;
  return res.status(200).json({success: true, code});
};


const createCodeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'createCode')) {
      const {form} = req.body;
      await Transaction.beginTransaction();
      if (await codeBuilder('interface', null,
        null, null, {}, {}, form)) {
        await Transaction.commit();
        return res.status(200).json({success: true});
      }
    }
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    if (Transaction.isActive())
      Transaction.rollback();
    next(e);
  }
};

const updateCodeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'updateCode'))
      return await updateCode(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const deleteCodeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'deleteCode'))
      return await deleteCode(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const deleteCode = async (req, res) => {
  const {uri} = req.params;
  const {checked} = req.body;
  if (!uri)
    throw new Server400Error('uri is required');

  if (checked) {
    await deleteDataAndAllReferees(uri, 'cids:hasCode');
    return res.status(200).json({message: 'Successfully deleted the object and all reference', success: true});
  } else {
    const {mandatoryReferee, regularReferee} = await checkAllReferees(uri, {
      'cids:Indicator': 'cids:hasCode',
      'cids:Outcome': 'cids:hasCode',
      'cids:Theme': 'cids:hasCode',
      'cids:StakeholderOutcome': 'cids:hasCode',
      'cids:Characteristic': 'cids:hasCode'
    })
    // const message = deletingObjectHelper(mandatoryReferee, regularReferee);
    return res.status(200).json({mandatoryReferee, regularReferee, success: true});
  }
};

const updateCode = async (req, res) => {
  const {form} = req.body;
  const {uri} = req.params;
  if (!form || !form.definedBy || !form.specification || !form.identifier || !form.name || !form.description || !form.codeValue || !form.iso72Value) {
    throw new Server400Error('Invalid input');
  }
  const code = await GDBCodeModel.findOne({_uri: uri}, {populates: ['iso72Value']});
  code.definedBy = form.definedBy;
  code.specification = form.specification;
  code.identifier = form.identifier;
  code.name = form.name;
  code.description = form.description;
  code.codeValue = form.codeValue;
  code.iso72Value.numericalValue = form.iso72Value;
  await code.save();
  return res.status(200).json({success: true});
};

// async function createCode(req, res) {
//   const {form} = req.body;
//   if (!form || !form.definedBy || !form.specification || !form.identifier || !form.name || !form.description || !form.codeValue || !form.iso72Value) {
//     throw new Server400Error('Invalid input');
//   }
//   const code = GDBCodeModel({
//     definedBy: form.definedBy,
//     specification: form.specification,
//     identifier: form.identifier,
//     name: form.name,
//     description: form.description,
//     codeValue: form.codeValue,
//     iso72Value: GDBMeasureModel({
//       numericalValue: form.iso72Value
//     })
//   }, {uri: form.uri});
//   await code.save();
//   return res.status(200).json({success: true});
//
//
// }

module.exports = {
  createCodeHandler, fetchCodeHandler, updateCodeHandler, deleteCodeHandler
};