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
    // return await User.findOne({ _id: this.ownerID });
    return await User.findById(this.ownerId)
  } catch(err) {
    console.error(err);
    return null;
  }
}

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
}

schema.statics.findIdentitiesByEmail = async function(email) {
  try {
    return await this.find({ email });
  } catch {
    console.error(err);
    return null;
  }
};

/*schema.statics.findIdentitiesByEmail = async function(email) {
  try {
    const identity = await this.find({ email });
  } catch {
    console.error(err);
    return null;
  }
}*/

/**
 # Module Exports
 */

module.exports = mongoose.model('Identity', schema);
