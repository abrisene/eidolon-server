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

const UsersSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  hash: String,
  salt: String,
});


/**
 # Schema Methods
 */


UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = hashPassword(password, this.salt);
};

UsersSchema.methods.validatePassword = function (password) {
  const hash = hashPassword(password, this.salt);
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

UsersSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
  };
};



/**
 # Module Exports
 */

mongoose.model('Users', UsersSchema);
