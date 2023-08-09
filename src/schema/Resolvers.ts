// Resolvers.ts
import { User } from '../model/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode'

const resolvers = {
  Query: {
    getUserProfile: async (_:any, __:any, {userId}: {userId: string}) => {
      if(!userId) throw new Error('Not authenticated.')
      const user = await User.findOne({_id: userId});
      if(!user) throw new Error("User does not exist.");
      return user;
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
    changePassword: async(_:any, {oldPassword, newPassword}:{ oldPassword:string, newPassword:string}, {userId}: {userId: string}) => {
      if(!userId) throw new Error('Not authenticated.')

      const user = await User.findOne({_id: userId});
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
    enableTwoFactor: async(_:any, __:any, {userId}: {userId: string}) => {
      if(!userId) throw new Error('Not authenticated.')
      const user = await User.findOne({_id: userId});
      if(!user) throw new Error("User does not exist.");
      if(user.twoFactorEnabled) throw new Error("Two factor already enabled.");

      user.twoFactorEnabled = true;
      await user.save();
      const secret = speakeasy.generateSecret({
        name: user.secretKey
      });

      qrcode.toDataURL(secret.otpauth_url as string, (err, data) => {
        if(err) throw new Error("Error generating QR code.");
        return data;
      });
    },
    disableTwoFactor: async(_:any, __:any, {userId}: {userId: string}) => {
      if(!userId) throw new Error('Not authenticated.')
      const user = await User.findOne({_id: userId});
      if(!user) throw new Error("User does not exist.");
      if(!user.twoFactorEnabled) throw new Error("Two factor already disabled.");

      user.twoFactorEnabled = false;
      await user.save();
      return true;
    },
    login: async(_:any, {email, password}:{email:string, password:string}) => {
      const user = await User.findOne({email});
      if(!user) throw new Error("Email or password is incorrect.");

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if(!isPasswordValid) throw new Error("Email or password is incorrect.");
      const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY as string);
      if(!user.twoFactorEnabled) {
        return {
          token,
          user,
        }
      }
      const secret = speakeasy.generateSecret({
        name: user.secretKey
      });
      qrcode.toDataURL(secret.otpauth_url as string, (err, data) => {
        if(err) throw new Error("Error generating QR code.");
        return {token,user,data};
      }
      );
    },
    verifyTwoFactorCode: async(_:any, {code}:{code: string}, {userId}: {userId: string}) => {
      if(!userId) throw new Error('Not authenticated.')
      const user = await User.findOne({_id: userId});
      if(!user) throw new Error("User does not exist.");
      if(!user.twoFactorEnabled) throw new Error("Two factor already disabled.");

      const verified = speakeasy.totp.verify({
        secret: user.secretKey,
        encoding: 'base32',
        token: code,
      });
      // if(!verified) throw new Error("Invalid two factor code.");
      return verified;
    },
  }
};

export default resolvers;