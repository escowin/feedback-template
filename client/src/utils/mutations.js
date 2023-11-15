import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
        password
      }
    }
  }
`;

export const ADD_COLLECTION = gql`
  mutation AddCollection($title: String!) {
    addCollection(title: $title) {
      _id
      createdAt
      title
    }
  }
`;

export const ADD_TEMPLATE = gql`
  mutation AddTemplate($collectionId: ID!, $title: String!) {
    addTemplate(collectionId: $collectionId, title: $title) {
      _id
      createdAt
      title
    }
  }
`;

export const ADD_TEXT = gql`
  mutation AddText($templateId: ID!, $text: String!, $type: String!) {
    addText(templateId: $templateId, text: $text, type: $type) {
      _id
      texts {
        _id
        createdAt
        type
        text
      }
    }
  }
`;

export const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(_id: $id) {
      _id
    }
  }
`;

export const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(_id: $id) {
      _id
    }
  }
`;

export const DELETE_TEXT = gql`
  mutation DeleteText($id: ID!, $templateId: ID!) {
    deleteText(_id: $id, templateId: $templateId) {
      _id
      texts {
        _id
      }
    }
  }
`;

export const EDIT_COLLECTION = gql`
  mutation EditCollection($id: ID!, $title: String!) {
    editCollection(_id: $id, title: $title) {
      _id
      createdAt
      title
    }
  }
`;

export const EDIT_TEMPLATE = gql`
  mutation EditTemplate($id: ID!, $title: String!) {
    editTemplate(_id: $id, title: $title) {
      _id
      createdAt
      title
    }
  }
`;

export const EDIT_TEXT = gql`
  mutation EditText($id: ID!, $templateId: ID!, $type: String, $text: String) {
    editText(_id: $id, templateId: $templateId, type: $type, text: $text) {
      _id
      texts {
        _id
        createdAt
        type
        text
      }
    }
  }
`;
