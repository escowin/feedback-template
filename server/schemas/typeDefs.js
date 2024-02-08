const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    collections: [Collection]
    logbook: [Logbook]
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
    texts: [Text]
  }

  type Text {
    _id: ID
    createdAt: String
    type: String
    text: String
  }

  type Logbook {
    _id: ID
    createdAt: String
    date: String
    grades: [Grade]
  }

  type Grade {
    _id: ID
    createdAt: String
    assignment: String
    grade: Int
    url: String
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
    logbook(_id: ID!): Logbook
    logbooks: [Logbook]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth

    addCollection(title: String!): Collection
    editCollection(_id: ID!, title: String!): Collection
    deleteCollection(_id: ID!): Collection

    addTemplate(collectionId: ID!, title: String!): Template
    editTemplate(_id: ID!, title: String!): Template
    deleteTemplate(_id: ID!): Template

    addText(templateId: ID!, type: String!, text: String!): Template
    editText(_id: ID!, templateId: ID!, type: String, text: String): Template
    deleteText(_id: ID!, templateId: ID!): Template

    addLogbook(date: String!): Logbook
    editLogbook(_id: ID!, date: String!): Logbook
    deleteLogbook(_id: ID!): Logbook

    addGrade(logbookId: ID!, assignment: String!, grade: Int!, url: String!): Grade
    editGrade(_id: ID!, logbookId: ID!, assignment: String, grade: Int, url: String): Grade
    deleteGrade(_id: ID!, logbookId: ID!): Grade
  }
`;

module.exports = typeDefs;
