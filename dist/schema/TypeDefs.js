"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getAllUsers: [User!]!
  }
`;
exports.default = typeDefs;
