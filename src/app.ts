import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schema/TypeDefs';
import resolvers from './schema/Resolvers';
import connectDb from './config/Mongoose';

require('dotenv').config();

connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


startStandaloneServer(server).then(({url})=>{
  console.log(`🚀 Server ready at ${url}`);
});
