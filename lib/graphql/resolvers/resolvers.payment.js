/*
 # resolvers.payment.js
 # Payment GraphQL Resolvers
 */

/*
 # Module Dependencies
 */

// const passport = require('passport');

// const config = require('../../configs');

/*
 # Resolvers
 */


const query = {
  orderHistory: async (_, __, { user }) => user.purchases || undefined,
  products: async (_, __, { models }) => models.Product.find(),
  skus: async (_, __, { models }) => models.Sku.find().populate('product'),
};

const product = {
  id: parent => parent.id || parent._id,
  skus: async (parent, _, { models }) => models.Sku.find({ product: parent._id }),
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
};

const sku = {
  id: parent => parent.id || parent._id,
  product: async parent => parent.product,
  productId: async parent => parent.product._id,
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
};

const order = {
  id: parent => parent.id || parent._id,
  // user: async (parent, __, { models }) => models.User.findOne({ _id: parent.userId }),
  // skus: async (parent, __, { models }) => models.
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
};

const mutation = {
  purchase: async (_, { input }, { user, models }) => {
    try {
      // console.log(input);
      if (!user) throw new Error('Can\'t make purchase: User is not logged in.');
      const { token, provider, retainSource } = input;
      const sale = await models.Sku.findOne({ _id: input.sku });
      if (!sale) throw new Error(`Cannot complete purchase: Sku ${sku} not found.`);
      //
      // >>>>> CREATE ORDER HERE
      // console.log(sale);
      if (retainSource) {
        // >>>>> TODO: Save Source to Customer
      }
      const orderInstance = await user.createOrder(provider, [{ parent: input.sku, amount: sale.price }], token);
      console.log(order);
      return orderInstance;
    } catch (err) {
      console.error(err);
      return { err };
    }
  },
  redeemPurchase: async (_, { input }, { user, models }) => {
    return null;
  },
};

/*
 # Module Exports
 */

module.exports = {
  Query: query,
  Mutation: mutation,
  Product: product,
  Sku: sku,
  Order: order,
};
