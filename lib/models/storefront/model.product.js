/*
 # model.product.js
 # Product Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('../../configs');
const constants = require('../../constants');
const { trimObject } = require('../../common');

/*
 # Critical Variables
 */

const CON = constants.storefront;

/*
 # Utility Methods
 */

const syncStripe = async (doc) => {
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    const sObj = client.products;
    const syncFn = doc.isNew ? o => sObj.create(o)
      : o => sObj.update(doc._id.toString(), o);
    
    let oConfig = {
      name: doc.name,
      active: doc.active,
      metadata: doc.metadata,
    };

    if (doc.isNew) {
      oConfig.id = doc._id.toString();
      oConfig.type = doc.type;
      oConfig.attributes = doc.attributes;
    }

    oConfig = trimObject(oConfig);
    const result = await syncFn(oConfig);

    return result;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

/*
 # Schema
 */

// https://stripe.com/docs/api/node#create_product

const schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, default: 'good' }, // service, plan, good
  active: { type: Boolean, default: true },
  status: { type: String, default: 'active' },
  attributes: [String],
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
    }
    return this;
  } catch (err) {
    console.error(err);
    return { err };
  }
});

schema.pre('remove', async function () {
  try {
    const storefront = config.get('storefront');
    const { stripe } = storefront;
    if (stripe !== undefined) await stripe.client.products.del(this._id.toString());

    // TODO: Remove all associated Skus ===========================================

    return this;
  } catch (err) {
    console.error(err);
    return { err };
  }
});

/**
 # Schema Methods
 */

schema.methods.activate = function () {
  const PS = CON.productStatus;
  return this.setStatus(PS.active);
};

schema.methods.deactivate = function () {
  const PS = CON.productStatus;
  return this.setStatus(PS.disabled);
};

schema.methods.setStatus = async function (status) {
  let result;
  const PS = CON.productStatus;
  try {
    if (!status) throw new Error(`Could not apply undefined status to Product: ${this.name}`);
    switch (status) {
      case PS.active:
        this.status = PS.active;
        this.active = true;
        break;
      case PS.staging:
        this.status = PS.staging;
        this.active = true;
        break;
      case PS.debug:
        this.status = PS.staging;
        this.active = true;
        break;
      case PS.disabled:
      default:
        this.status = PS.disabled;
        this.active = false;
        break;
    }
    return this.save();
  } catch (err) {
    result = { err };
    return result;
  }
};

schema.methods.addSku = function (sku) {
  const Sku = this.db.model('Sku');
  const doc = new Sku({ ...sku, product: this._id });
  return doc.save();
};

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Product', schema);
