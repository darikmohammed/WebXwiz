import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schema/TypeDefs';
import resolvers from './schema/Resolvers';
import connectDb from './config/Mongoose';
import { getUserIdFromToken } from './utils/auth';
import { BaseContext } from './utils/BaseContext';
import { User } from './model/User';

require('dotenv').config();

connectDb();

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  context: async ({ req }: { req: any }) => {
    const token:string = req.headers.authorization || '';
    
    let value = null
    

    if (!req.body.query.includes('signup') && !req.body.query.includes('login')) {
      value = getUserIdFromToken(token);
    }    

    const context: BaseContext = {
      userId: value ? value.userId : null,
      user: value ? await User.findOne({_id: value.userId}) : null,
      requireTwoFactor: value ? value.requireTwoFactor : false,
    };

    return context;
  }
}).then(({url})=>{
  console.log(`🚀 Server ready at ${url}`);
});

