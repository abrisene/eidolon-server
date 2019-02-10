/*
 # schema.payment.js
 # Message GraphQL Schema
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');

/*
 # Schema
 */

const schema = gql`


  extend type Query {
    orderHistory: [Order!]
    products: [Product!]
    skus: [Sku!]
  }

  type Product {
    id: ID!
    name: String!
    type: String!
    active: Boolean!
    status: String!
    skus: [Sku!]
    attributes: [String!]
    tsCreated: Float!
    tsUpdated: Float!
  }

  type Sku {
    id: ID!
    name: String!
    product: Product!
    productId: ID!
    price: Int!
    currency: String!
    active: Boolean!
    status: String!
    attributes: [String!]
    image: String
    tsCreated: Float!
    tsUpdated: Float!
  }

  type Order {
    id: ID!
    sku: Sku
    amount: Int!
    currency: String
    status: String!
    provider: String
    tsCreated: Float!
    tsUpdated: Float!
  }

  type Charge {
    id: ID!
    amount: Int!
    currency: String
    provider: String
  }

  extend type Mutation {
    purchase(input: PurchaseInput): Order
    redeemPurchase(input: RedeemTokenInput): Order
  }

  input PurchaseInput {
    token: ID!
    sku: ID!
    provider: String!
    retainSource: Boolean
  }

  input RedeemTokenInput {
    token: ID!
  }
`;

/*
 # Module Exports
 */

module.exports = schema;
