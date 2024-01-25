const Hashing = require("../../utils/hashing");
const {GDBUserAccountModel, GDBSuperPasswordModel} = require('../../models/userAccount');
const {Server400Error} = require("../../utils");
const {GDBOrganizationModel} = require("../../models/organization");



async function updateUserPassword(email, newPassword) {
  const userAccount = await GDBUserAccountModel.findOne({email: email});
  if(!userAccount)
    throw new Server400Error('Wrong email provided');
  const {hash, salt} = await Hashing.hashPassword(newPassword);
  userAccount.hash = hash;
  userAccount.salt = salt;
  await userAccount.save();
  const saved = await Hashing.validatePassword(newPassword, userAccount.hash, userAccount.salt);
  return {saved, userAccount}
}


async function updateUserAccount(email, updatedData) {
  const userAccount = await GDBUserAccountModel.findOne({email: email});
  if(!userAccount)
    throw new Server400Error('Wrong email given');

  const {
    securityQuestions,
  } = updatedData
  if (securityQuestions) {
    const answer1 = await Hashing.hashPassword(securityQuestions[3]);
    const securityQuestion1 = {
      question: securityQuestions[0],
      hash: answer1.hash,
      salt: answer1.salt
    }
    const answer2 = await Hashing.hashPassword(securityQuestions[4]);
    const securityQuestion2 = {
      question: securityQuestions[1],
      hash: answer2.hash,
      salt: answer2.salt
    }
    const answer3 = await Hashing.hashPassword(securityQuestions[5]);
    const securityQuestion3 = {
      question: securityQuestions[2],
      hash: answer3.hash,
      salt: answer3.salt
    }
    userAccount.securityQuestions = [securityQuestion1, securityQuestion2, securityQuestion3]

  }
  // if (status) {
  //   userAccount.status = status
  // }
  // // add more if needed TODO
  // if (givenName) {
  //   if (!userAccount.primaryContact) {
  //     userAccount.primaryContact = {};
  //   }
  //   userAccount.primaryContact.givenName = givenName;
  // }
  //
  // if (familyName) {
  //   userAccount.primaryContact.familyName = familyName;
  // }
  //
  // if (countryCode) {
  //   if (!userAccount.primaryContact.telephone) {
  //     userAccount.primaryContact.telephone = {};
  //   }
  //   userAccount.primaryContact.telephone.countryCode = countryCode;
  // }
  //
  // if (areaCode) {
  //   userAccount.primaryContact.telephone.areaCode = areaCode;
  // }
  //
  // if (phoneNumber) {
  //   userAccount.primaryContact.telephone.phoneNumber = phoneNumber;
  // }
  //
  // if (altEmail) {
  //   userAccount.secondaryEmail = altEmail;
  // }

  await userAccount.save();
  return userAccount;
}





async function validateCredentials(email, password) {
  const userAccount = await GDBUserAccountModel.findOne({email: email});
  if(!userAccount)
    throw new Server400Error('No such user under this email.');
  if(!userAccount.hash || !userAccount.salt)
    throw new Server400Error('The user is not registered.')
  const validated = await Hashing.validatePassword(password, userAccount.hash, userAccount.salt);
  return {validated, userAccount};
}

async function addSuperPassword() {
  const alreadyHas = await GDBSuperPasswordModel.findOne({});
  if (!alreadyHas) {
    const {hash, salt} = await Hashing.hashPassword('MIEUofT');
    const superPassword = GDBSuperPasswordModel({
      hash, salt
    });
    await superPassword.save();
  }
}

async function addSampleOrganizations() {
  const alreadyHas = await GDBOrganizationModel.findOne({_uri: 'http://www.b12give.ca'});
  if (!alreadyHas) {
    const org1 = GDBOrganizationModel({
      legalName: 'B12Give',
      legalStatus: 'For Profit'
    }, {uri: 'http://www.b12give.ca'})
    const org2 = GDBOrganizationModel({
      legalName: 'Org1',
      legalStatus: 'For Charity'
    }, {uri: 'http://www.demo.ca/Organization/Organization1'})
    const org3 = GDBOrganizationModel({
      legalName: 'Org2'
    }, {uri: 'http://www.demo.ca/Organization/Organization2'})
    await org1.save();
    await org2.save();
    await org3.save();
  }
}

/**
 * Check if the database contains at least one user account.
 * If not, create a default user account.
 * @return {Promise<void>}
 */
async function initUserAccounts() {
  const account = await GDBUserAccountModel.findOne({});

  // No account in the database
  if (!account) {
    const {hash, salt} = await Hashing.hashPassword('superuser');

    const answer1 = await Hashing.hashPassword('UofT');
    const securityQuestion1 = {
      question: 'What university is CSSE associated with?',
      hash: answer1.hash,
      salt: answer1.salt
    }
    const answer2 = await Hashing.hashPassword('MIE');
    const securityQuestion2 = {
      question: 'What is CSSE\'s home department?',
      hash: answer2.hash,
      salt: answer2.salt
    }
    const answer3 = await Hashing.hashPassword('Ontario');
    const securityQuestion3 = {
      question: 'Which province is University of Toronto located in?',
      hash: answer3.hash,
      salt: answer3.salt
    }


    const userAccount = GDBUserAccountModel({
      email: 'superuser@pathfinder.ca',
      // userTypes: [':superuser'],
      isSuperuser: true,
      editorOfs: [],
      reporterOfs: [],
      administratorOfs: [],
      groupAdminOfs: [],
      researcherOfs: [],
      securityQuestions: [
        securityQuestion1, securityQuestion2, securityQuestion3
      ],
      hash, salt,
      person: {
        familyName: 'MIE',
        givenName: 'CSSE',
      }
    });


    await userAccount.save();
  }

}


module.exports = {
  updateUserAccount, validateCredentials, initUserAccounts, updateUserPassword, addSuperPassword, addSampleOrganizations
};
