"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const TypeDefs_js_1 = __importDefault(require("./schema/TypeDefs.js"));
const Resolvers_js_1 = __importDefault(require("./schema/Resolvers.js"));
// The GraphQL schema
// const typeDefs = `#graphql
//   type User {
//     id: ID!
//     email: String!
//   }
//   type AuthPayload {
//     token: String!
//     user: User!
//   }
//   type Query {
//     getAllUsers: [User!]!
//   }
// `;
// // A map of functions which return data for the schema.
// const resolvers = {
//   Query: {
//     getAllUsers: () => 'world',
//   },
// };
const server = new server_1.ApolloServer({
    typeDefs: TypeDefs_js_1.default,
    resolvers: Resolvers_js_1.default,
});
const { url } = await (0, standalone_1.startStandaloneServer)(server);
console.log(`🚀 Server ready at ${url}`);
