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
    ownerID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    clientID: String,
    displayName: String,
    metadata: Object,
    tsValidated: Date,
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
    return await User.findOne({ _id: this.ownerID });
  } catch(err) {
    console.error(err);
  }
}

/**
 # Static Schema Methods
 */

schema.statics.findEmail = async function(email = '') {
  try {
    return await this.findOne({ type: 'email', email });
  } catch(err) {
    console.error(err);
  }
}

/**
 # Module Exports
 */

module.exports = mongoose.model('Identity', schema);
