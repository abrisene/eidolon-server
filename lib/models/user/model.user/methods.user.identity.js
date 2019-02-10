/*
 # methods.user.identity.js
 # User Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

/*
 # Critical Variables
 */

// const constUser = constants.user;

/*
 # Utility Methods
 */

/*
 # Schema
 */

const schema = { methods: {}, statics: {} };

/*
 # Middleware
 */

/**
 # Schema Methods
 */

schema.methods.linkIdentity = async function (identity) {
  try {
    identity.ownerId = this._id;
    this.identities.push(identity._id);

    if (identity.email && !this.emails.includes(identity.email)) {
      this.emails.push(identity.email);
    }

    return this;
  } catch (err) {
    // console.error(err);
    return this;
  }
};

schema.methods.getIdentities = async function () {
  try {
    const Identity = this.db.model('Identity');
    let identities = this.identities.map(i => mongoose.Types.ObjectId(i));
    identities = await Identity.find({ '_id': { $in: identities } });
    return identities;
  } catch (err) {
    // console.error(err);
    return [];
  }
};
/**
 # Module Exports
 */

module.exports = schema;
