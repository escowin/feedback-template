import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      collections {
        _id
        createdAt
        title
        templates {
          _id
          title
        }
      }
    }
  }
`;

export const QUERY_COLLECTIONS = gql`
  query Templates {
    collections {
      _id
      createdAt
      title
      templates {
        _id
        createdAt
        title
      }
    }
  }
`;

export const QUERY_COLLECTION = gql`
  query Collection($id: ID!) {
    collection(_id: $id) {
      _id
      createdAt
      title
      templates {
        _id
        title
        createdAt
      }
    }
  }
`;

export const QUERY_TEMPLATES = gql`
  query Templates {
    templates {
      _id
      createdAt
      title
      texts {
        _id
        createdAt
        type
        text
      }
    }
  }
`;

export const QUERY_TEMPLATE = gql`
  query Templates($id: ID!) {
    template(_id: $id) {
      _id
      createdAt
      title
      texts {
        _id
        createdAt
        type
        text
      }
    }
  }
`;
