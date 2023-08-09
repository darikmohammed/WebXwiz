const typeDefs = `
  type User {
    id: ID!
    email: String!
    twoFactorEnabled: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
    qrCode: String
  }

  type Query {
    getUserProfile: User!
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    changePassword(oldPassword: String!, newPassword: String!): Boolean!
    enableTwoFactor: String!
    disableTwoFactor: Boolean!
    login(email: String!, password: String!): AuthPayload!
    verifyTwoFactorCode(code: String!): Boolean!
  }
`;

export default typeDefs;