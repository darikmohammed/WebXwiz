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

export default typeDefs;