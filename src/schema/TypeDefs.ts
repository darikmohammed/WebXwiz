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

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    changePassword(oldPassword: String!, newPassword: String!): Boolean!
  }
`;

export default typeDefs;