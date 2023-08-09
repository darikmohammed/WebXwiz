import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  secretKey: string;
  twoFactorEnabled: boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  secretKey: { type: String, required: true },
  twoFactorEnabled: { type: Boolean, default: false },
});

const User = mongoose.model<IUser>('User', UserSchema);

export {User}