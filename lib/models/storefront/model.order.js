/*
 # model.order.js
 # Order Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('../../configs');
// const constants = require('../../constants');
const { syncStripeClient } = require('./utils.storefront');

/*
 # Critical Variables
 */

// const CON = constants.storefront;

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

const syncStripe = d => syncStripeClient(d, 'orders', (doc) => {
  const syncConfig = {
    coupon: doc.coupon,
    // status: doc.status,
    metadata: doc.metadata,
  };

  if (doc.isNew) {
    // syncConfig.id = doc._id.toString();
    syncConfig.email = doc.email;
    syncConfig.customer = doc.customerId;
    syncConfig.currency = doc.currency;
    syncConfig.items = doc.items;
    // syncConfig.items = doc.items.map(i => i.toObject());
  }
  return syncConfig;
}, x => x.orderId);


/*
 # Schema
 */

const schema = new Schema({
  provider: { type: String, required: true },
  amount: { type: Number },
  status: { type: String },
  email: { type: String },
  orderId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: String },
  charge: [],
  coupon: { type: String },
  currency: { type: String, required: true, default: 'usd' },
  items: [Object],
  metadata: Object,
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

schema.pre('save', async function () {
  try {
    const storefront = config.get('storefront');
    const { stripe } = storefront;
    if (stripe !== undefined) {
      const stripeUpdate = await syncStripe(this);
      if (stripeUpdate.err) throw new Error(stripeUpdate.err);
      this.orderId = stripeUpdate.id;
      this.status = stripeUpdate.status;
      this.charge = stripeUpdate.charge;
      this.amount = stripeUpdate.amount;
      console.log(stripeUpdate);
    }
    return this;
  } catch (err) {
    console.error(err);
    return { err };
  }
});

schema.pre('remove', async function () {
  return this;
  /* try {
    const storefront = config.get('storefront');
    const { stripe } = storefront;
   if (stripe !== undefined) await stripe.client.orders.del(this._id.toString());

    return this;
  } catch (err) {
    console.error(err);
    return { err };
  } */
});

/**
 # Schema Methods
 */

schema.methods.pay = async function (source) {
  try {
    const storefront = config.get('storefront');
    const { stripe } = storefront;
    let result;
    if (stripe !== undefined) {
      const oConfig = {
        source,
        customer: this.customerId,
      };
      console.log(this);
      result = await stripe.client.orders.pay(this.orderId, oConfig);
      this.status = result.status;
      this.charge = result.charge;
      this.amount = result.amount;
      await this.save();
    }
    return result;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Order', schema);
