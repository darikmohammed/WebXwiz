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
    },
    changePassword: async(_:any, {oldPassword, newPassword}:{ oldPassword:string, newPassword:string}, {userId}: {userId: String}) => {
      if(!userId) throw new Error('Not authenticated.')

      const user = await User.findOne({userId});
      if (!user) {
        throw new Error('User does not exist.');
      }
      
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password.');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return true;
    },
  }
};

export default resolvers;