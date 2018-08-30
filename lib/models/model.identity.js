/*
 # model.user.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const config = require('../configs');

const Token = require('./model.token');

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

/*
 # Schema
 */

const schema = new Schema({
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: String,
    gender: String,
    metadata: Object,
    tsValidated: Date,
    tsAccessed: Date,
  },
  {
    timestamps: {
      createdAt: 'tsCreated',
      updatedAt: 'tsUpdated',
    },
  });

/*
 # Middleware
 */

/*schema.pre('save', function(next) {
  next();
});*/


/**
 # Schema Methods
 */

schema.methods.getUser = async function() {
  try {
    const User = this.db.model('User');
    return await User.findById(this.ownerId)
  } catch(err) {
    console.error(err);
    return null;
  }
};

schema.methods.generateToken = async function(type, duration = 86400) {
  try {
    const token = new Token({
      ownerId: this._id,
      type,
      expireAt: Date.now() + (duration * 1000),
    });

    await token.save();

    return token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 # Static Schema Methods
 */

schema.statics.findIdentity = async function(type, id) {
  try {
    const query = { type, key: id };
    return await this.findOne(query);
  } catch {
    console.error(err);
    return null;
  }
};

schema.statics.findIdentitiesByEmail = async function(email) {
  try {
    return await this.find({ email });
  } catch {
    console.error(err);
    return null;
  }
};

schema.statics.validateWithToken = async function(hash) {
  try {
    const Identity = this;
    const Token = this.db.model('Token');

    const token = await Token.findOne({ token: hash });
    if (!token) throw `Could not find token ${hash}.`;
    if (!token.type === 'VALIDATE_IDENTITY') throw `Token ${token} (${token.type}) cannot be used to validate identity.`;

    const identity = await Identity.findOne({ _id: token.ownerId });
    if (!identity) throw `Could not find identity for token ${token}.`;

    const redeemed = await token.redeem();
    if (redeemed.err) throw redeemed.err;

    identity.tsValidated = redeemed.ts;

    await identity.save();
    return redeemed;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

/**
 # Module Exports
 */

module.exports = mongoose.model('Identity', schema);
