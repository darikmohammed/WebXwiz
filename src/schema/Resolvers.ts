// Resolvers.ts
import { User } from '../model/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    signup: async (_:any, {email, password}:{email:string, password:string}) => {
      const existingUser = await User.findOne({email});
      if (existingUser) {
        throw new Error('User already exists.');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        hashedPassword,
        secretKey: jwt.sign({email}, process.env.SECRET_KEY as string),
      });
      await user.save();
      const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY as string);
      return {
        token,
        user,
      }
    }
  }
};

export default resolvers;