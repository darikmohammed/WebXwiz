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
  }
`;

export default typeDefs;