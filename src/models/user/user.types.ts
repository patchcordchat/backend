import { Schema, type Document, Model, HydratedDocument } from 'mongoose';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  username: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  pronouns?: string;
  bio: string;
  verified: boolean;
  email?: string;
  phone?: string;
  flags: number;
  public_flags: number;
  password: string;
  tokens: { token: string }[];
  created_at: number;
  updated_at: number;
}

export enum UserFlags {
  NONE = 0,
  DELETED = 1 << 0,
  SELF_DELETED = 1 << 1,
  DISABLED = 1 << 2,
}

export enum UserPublicFlags {
  NONE = 0,
  STAFF = 1 << 3,
  SPAMMER = 1 << 4,
}

export interface IUserMethods {
  generateAuthToken(): Promise<string>;
  toJSON(): IUser;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByCredentials(
    email: string,
    password: string,
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}
