// Resolvers.ts
import { User } from '../model/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode'
import { GraphQLError } from 'graphql';

const resolvers = {
  Query: {
    getUserProfile: async (_:any, __:any, {userId}: {userId: string}) => {
      if(!userId) throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
      const user = await User.findOne({_id: userId});
      if(!user) throw new GraphQLError('User does not exist.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
      return user;
    },
  },

  Mutation : {
    signup: async (_:any, {email, password}:{email:string, password:string}) => {
      const existingUser = await User.findOne({email});
      if (existingUser) {
        throw new GraphQLError('User already exists.', {
          extensions: {
            code: 'DUPLICATE',
          },
        });
      }

      if (password.length < 8) {
        throw new GraphQLError('Password must be at least 8 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
      });

      await user.save();
      const token = jwt.sign({userId: user._id, requireTwoFactor: false}, process.env.SECRET_KEY as string);
      return {
        token,
        user,
      }
    },
    changePassword: async(_:any, {oldPassword, newPassword}:{ oldPassword:string, newPassword:string}, {userId, requireTwoFactor}: {userId: string, requireTwoFactor: boolean}) => {
      if(requireTwoFactor) throw new GraphQLError('Need to verify two factor code.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
      
      if(!userId) throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      const user = await User.findOne({_id: userId});
      if (!user) {
        throw new GraphQLError('User does not exist.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });

      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new GraphQLError('Invalid password.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
      }

      if(newPassword === oldPassword) throw new GraphQLError('New password must be different from old password.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

      if (newPassword.length < 8) {
        throw new GraphQLError('Password must be at least 8 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return true;
    },
    enableTwoFactor: async(_:any, __:any, {userId,requireTwoFactor }: {userId: string, requireTwoFactor: boolean}) => {
      if(!userId) throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(requireTwoFactor) throw new GraphQLError('Need to verify two factor code.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      const user = await User.findOne({_id: userId});
      if (!user) {
        throw new GraphQLError('User does not exist.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });

      }
      if(user.twoFactorEnabled) throw new GraphQLError('Two factor already enabled.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

      const secret = speakeasy.generateSecret();
      user.twoFactorEnabled = true;
      user.secretKey = secret.base32;

      await user.save();
      
      const token = jwt.sign({userId: user._id, requireTwoFactor: true}, process.env.SECRET_KEY as string);

      const qrCode = await qrcode.toDataURL(secret.otpauth_url as string);

      return {token, user, qrCode};
    },
    disableTwoFactor: async(_:any, __:any, {userId, requireTwoFactor}: {userId: string, requireTwoFactor: boolean}) => {
      if(!userId) throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(requireTwoFactor) throw new GraphQLError('Need to verify two factor code.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      const user = await User.findOne({_id: userId});
      if(!user) throw new GraphQLError('User does not exist.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(!user.twoFactorEnabled) throw new GraphQLError('Two factor already disabled.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

      user.twoFactorEnabled = false;
      await user.save();

      const token = jwt.sign({userId: user._id, requireTwoFactor: false}, process.env.SECRET_KEY as string);

      return {token, user};
    },
    login: async(_:any, {email, password}:{email:string, password:string}) => {
      const user = await User.findOne({email});      
      if(!user) throw new GraphQLError("Incorrect Email or Password.", {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if(!isPasswordValid) throw new GraphQLError("Incorrect Email or Password", {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
      
      const token = jwt.sign({userId: user._id, requireTwoFactor: user.twoFactorEnabled}, process.env.SECRET_KEY as string);
      if(!user.twoFactorEnabled) {
        return {
          token,
          user,
        }
      }
      const secret = speakeasy.generateSecret();
      user.secretKey = secret.base32
      await user.save();
      const qrCode = qrcode.toDataURL(secret.otpauth_url as string);
      return {token, user, qrCode};
    },
    verifyTwoFactorCode: async(_:any, {code}:{code: string}, {userId,requireTwoFactor }: {userId: string, requireTwoFactor:boolean}) => {
      if(!userId) throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(!requireTwoFactor) throw new GraphQLError('Can not verify a code for authenticated user.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      const user = await User.findOne({_id: userId});
      if(!user) throw new GraphQLError('User does not exist.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(!user.twoFactorEnabled) throw new GraphQLError('Two factor not enabled.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

      const verified = speakeasy.totp.verify({
        secret: user.secretKey,
        encoding: 'base32',
        token: code,
      });
      if(!verified) throw new GraphQLError('Invalid code.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

      const token = jwt.sign({userId: user._id, requireTwoFactor: false}, process.env.SECRET_KEY as string);

      return {
        token,
        user
      }
    },
    generateQrCode: async (_:any, __:any, {userId, requireTwoFactor}: {userId: string, requireTwoFactor: boolean}) => {
      if(!userId) throw new GraphQLError('You are not authorized to perform this action.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(!requireTwoFactor) throw new GraphQLError('Can not generate a qr code for authenticated user.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
      
      const user = await User.findOne({_id: userId});
      if(!user) throw new GraphQLError('User does not exist.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

      if(!user.twoFactorEnabled) throw new GraphQLError('Two factor already disabled.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

      const secret = speakeasy.generateSecret();   
      user.secretKey = secret.base32
      await user.save()   
      const qrCode = await qrcode.toDataURL(secret.otpauth_url as string);
      return qrCode;
    },
  }
};

export default resolvers;