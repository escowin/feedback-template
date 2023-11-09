const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    collections: [Collection]
  }

  type Collection {
    _id: ID
    createdAt: String
    title: String
    templates: [Template]
  }

  type Template {
    _id: ID
    createdAt: String
    title: String
    strings: [String]
  }

  type String {
    _id: ID
    createdAt: String
    type: String
    string: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    collection(_id: ID!): Collection
    collections: [Collection]
    template(_id: ID!): Template
    templates: [Template]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth

    addCollection(title: String!): Collection
    editCollection(_id: ID!, title: String!): Collection
    deleteCollection(_id: ID!): Collection

    addTemplate(title: String!): Template
    editTemplate(_id: ID!, title: String!): Template
    deleteTemplate(_id: ID!): Template

    addString(type: String!, string: String!): Template
    editString(_id: ID!, type: String!, string: String!): Template
    deleteString(_id: ID!, type: String!, string: String!): Template
  }
`;

module.exports = typeDefs;
