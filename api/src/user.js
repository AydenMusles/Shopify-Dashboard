require('dotenv').config();
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });
const db = require('../db');

async function addUser(profile) {
  //checks if the current user in in the db and finds it
  let userData = await db.User.findOne({
    where: {
      userId: profile.sub,
    },
  }).catch((err) => {
    logger.error('Error finding the user in db', err);
  });

  //If no user is found in the db it creates one
  if (!userData) {
    //Save the Auth0 user information to db
    userData = await db.User.create({
      userId: profile.sub,
      firstName: profile.given_name,
      lastName: profile.family_name,
      fullName: profile.name,
      nickName: profile.nickname,
      picture: profile.picture,
    }).catch((err) => {
      logger.error('Error creating the user in the db', err);
    });
  }

  // logger.info(JSON.stringify(userData));

  //Return db user data
  return userData;
}

//Finds all users in db
//TODO: Remove this for production
async function findAllUsers() {
  let userData = await db.User.findAll().catch((err) => {
    logger.error('Error finding users in db', err);
  });

  //Returns all users from db
  return userData;
}

//Gets current users data from db
async function getUser(userId) {
  //Finds the single user in the db
  let userData = await db.User.findOne({
    where: {
      userId: userId,
    },
  }).catch((err) => {
    logger.error('User could not be found in db', err);
  });

  //Returns all the current user data
  return userData;
}

module.exports.addUser = addUser;
module.exports.findAllUsers = findAllUsers;
module.exports.getUser = getUser;
