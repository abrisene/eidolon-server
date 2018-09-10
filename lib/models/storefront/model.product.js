/*
 # model.product.js
 # Stripe Product Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('../../configs');

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

/*
 # Schema
 */

// https://stripe.com/docs/api/node#create_product

const schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, default: 'good' }, // service, plan, good
  active: { type: Boolean, default: true },
  attributes: [String],
  metadata: Object,
  caption: String, // Goods only
  description: String, // Goods only
  url: Object, // Goods only
  images: [String], // Goods only
  deactivateOn: [String], // Goods only
  packageDimensions: Object, // Goods only
  shippable: { type: Boolean, default: false }, // Goods only
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
    const { client } = storefront.stripe;
    let productFn;

    if (this.isNew) {
      productFn = p => client.products.create(p);
    } else {
      productFn = p => client.products.update(this._id.toString(), p);
    }

    let productConfig = {
      name: this.name,
      active: this.active,
      metadata: this.metadata,
    };

    if (this.isNew) {
      productConfig.id = this._id.toString();
      productConfig.type = this.type;
      productConfig.attributes = this.attributes;
    }

    if (this.type === 'good') {
      productConfig.caption = this.caption;
      productConfig.description = this.description;
      productConfig.url = this.url;
      productConfig.images = this.images;
      productConfig.deactivateOn = this.deactivateOn;
      productConfig.packageDimensions = this.packageDimensions;
      productConfig.shippable = this.shippable;
    }

    productConfig = Object.keys(productConfig).reduce((a, key) => {
      const obj = { ...a };
      const value = productConfig[key];

      if (Array.isArray(value) && value.length > 0) {
        obj[key] = value;
      } else if (!Array.isArray(value) && value !== undefined) {
        obj[key] = value;
      }
      return obj;
    }, {});

    const product = await productFn(productConfig);

    return product;
  } catch (err) {
    console.error(err);
    return err;
  }
});

schema.pre('remove', async function () {
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    return await client.products.del(this._id.toString());
  } catch (err) {
    console.error(err);
    return err;
  }
});

/**
 # Schema Methods
 */

schema.methods.addSKU = async function (sku) {
  const SKU = this.db.model('SKU');
  return new SKU({ ...sku, product: this._id });
};

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Product', schema);
