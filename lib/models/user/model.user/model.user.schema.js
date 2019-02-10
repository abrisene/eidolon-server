/*
 # model.user.js
 # User Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const identityMethods = require('./methods.user.identity');
const authMethods = require('./methods.user.auth');
const paymentMethods = require('./methods.user.payment');


/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

const stitchSchema = (schema, methods) => {
  Object.keys(methods).forEach((typeKey) => {
    Object.keys(methods[typeKey]).forEach((methodKey) => {
      schema[typeKey][methodKey] = methods[typeKey][methodKey];
    });
  });
  return schema;
};

/*
 # Schema
 */

const schema = new Schema({
  email: { type: String, trim: true },
  identities: [{ type: Schema.Types.ObjectId, ref: 'Identity' }],
  roles: [String],
  emails: [{ type: String, trim: true }],
  customerIds: {
    stripe: String,
    braintree: String,
    paypal: String,
    square: String,
  },
  paymentSources: {
    stripe: [String],
    braintree: [String],
    paypal: [String],
    square: [String],
  },
  purchases: [{ type: Schema.Types.ObjectId }],
  properties: { type: Object, default: {} },
  hash: String,
  tsLogin: [Date],
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

/**
 # Schema Methods
 */

stitchSchema(schema, identityMethods);
stitchSchema(schema, authMethods);
stitchSchema(schema, paymentMethods);

/**
 # Module Exports
 */

module.exports = mongoose.model('User', schema);
