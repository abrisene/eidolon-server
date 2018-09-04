/*
 # model.token.js
 # Token Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const crypto = require('crypto');

const config = require('../configs');

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

const generateToken = (len = 32) => {
  const hash = crypto.randomBytes(len).toString('hex');
  return hash;
}

/*
 # Schema
 */

const schema = new Schema({
    ownerId: { type: Schema.Types.ObjectId },
    type: { type: String, required: true },
    token: { type: String, required: true, default: () => generateToken(32) },
    uses: { type: Number, default: 1 },
    persist: { type: Boolean, default: false },
    tsExpiration: { type: Date, default: Date.now() + (86400 * 3 * 1000) },
    tsRedeemed: Date,
  },
  {
    timestamps: {
      createdAt: 'tsCreated',
    },
  });

schema.index(
  { tsExpiration: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpresson: { persist: { $eq: false } },
  },
);

/*
 # Middleware
 */


/**
 # Schema Methods
 */

schema.methods.redeem = async function() {
  const result = {};
  try {
    const ts = Date.now();
    if (this.uses <= 0) throw `Token ${this.token} has no uses remaining`;
    if (ts > this.tsExpiration) throw `Token ${this.token} has expired.`;
    this.uses -= 1;
    this.tsRedeemed = ts;

    await this.save();

    result.success = true;
    result.status = 'success';
    result.usesRemaining = this.uses;
    result.ts = ts;

    return result
  } catch (err) {
    console.error(err);
    result.err = err;
    return result;
  }
};

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Token', schema);
