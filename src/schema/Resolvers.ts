// Resolvers.ts
const resolvers = {
  Query: {
    getAllUsers: () => {
      return [{
        id: 1,
        email: 'john@gmail.com',
      }]
    },
  },

  Mutation : {
    signup: () => {
      return { 
      }
    },
  }
};

export default resolvers;