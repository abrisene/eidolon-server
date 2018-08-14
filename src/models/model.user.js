/*
 # model.users.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

import crypto from 'crypto'; // Replace with bcrypt
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
// import passportLocalMongoose from 'passport-local-mongoose';

import config from '../configs';

/*
 # Utility Methods
 */

const hashPassword = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 1000, 512, 'sha512')
    .toString('hex');
}


/*
 # Schema
 */

const schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  hash: String,
  salt: String,
});

/*
 # Plugins
 */

const options = {
  usernameField: 'email',
  lastLoginField: 'lastLoginTS',
  usernameLowerCase: true,
};

// schema.plugin(passportLocalMongoose, options);


/**
 # Schema Methods
 */


/*schema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = hashPassword(password, this.salt);
};

schema.methods.validatePassword = function (password) {
  const hash = hashPassword(password, this.salt);
  return this.hash === hash;
};*/

/*schema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

schema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
  };
};*/

schema.methods.generateJWT = function() {
  
}



/**
 # Module Exports
 */

module.exports = mongoose.model('User', schema);
