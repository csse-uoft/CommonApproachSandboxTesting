const {GDBThemeModel} = require("../../models/theme");
const {hasAccess} = require("../../helpers/hasAccess");
const {Transaction} = require("graphdb-utils");
const {themeBuilder} = require("./themeBuilder");
const {configLevel} = require('../../config');
const {outcomeBuilder} = require("../outcomes/outcomeBuilder");

const createTheme = async (req, res) => {
    const form = req.body;
    if (!form.name || !form.description)
      return res.status(400).json({success: false, message: 'Name and description are needed'});
    // if (await GDBThemeModel.findOne({hasIdentifier: form.identifier}))
    //   return res.status(400).json({success: false, message: 'Duplicated Identifier'})
  // form.hasIdentifier = form.identifier;
    const theme = GDBThemeModel({
      name: form.name,
      description: form.description,
    }, form.uri?{uri: form.uri}:null);
    await theme.save();
    return res.status(200).json({success: true, message: 'Successfully created the theme'});
};

const fetchTheme = async (req, res) => {
  const {uri} = req.params;
  if (!uri)
    return res.status(400).json({success: false, message: 'Uri is needed'});
  const theme = await GDBThemeModel.findOne({_uri: uri});
  if (!theme)
    return res.status(400).json({success: false, message: 'No such theme'});
  // theme.identifier = theme.hasIdentifier;
  return res.status(200).json({success: true, theme});
};

const updateTheme = async (req, res) => {
  const {form} = req.body;
  const {uri} = req.params;
  await Transaction.beginTransaction();
  form.uri = uri;
  if (await themeBuilder('interface', null,null, {}, {}, form, configLevel)) {
    await Transaction.commit();
    return res.status(200).json({success: true});
  }
};

const deleteTheme = async (req, res, next) => {
  try {
    const {id} = req.params;
    if (!id)
      return res.status(400).json({success: false, message: 'Id is needed'});
    await GDBThemeModel.findAndDelete({_id: id});
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const createThemeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'createTheme')) {
      const {form} = req.body;
      await Transaction.beginTransaction();
      if (await themeBuilder('interface', null, null, {}, {}, form, configLevel)){
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

const fetchThemeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'fetchTheme'))
      return await fetchTheme(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    next(e);
  }
};

const updateThemeHandler = async (req, res, next) => {
  try {
    if (await hasAccess(req, 'updateTheme'))
      return await updateTheme(req, res);
    return res.status(400).json({message: 'Wrong Auth'});
  } catch (e) {
    if (Transaction.isActive())
      Transaction.rollback();
    next(e);
  }
};


module.exports = {createThemeHandler, fetchThemeHandler, deleteTheme, updateThemeHandler};