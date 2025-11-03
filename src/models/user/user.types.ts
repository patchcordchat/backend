import { Schema, type Document, Model, HydratedDocument } from 'mongoose';

export interface IUser extends Document {
  _id: Schema.Types.UUID;
  id: Schema.Types.UUID;
  username: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  pronouns?: string;
  bio: string;
  locale: string;
  verified: boolean;
  email?: string;
  phone?: string;
  flags: number;
  public_flags: number;
  password: string;
  tokens: { token: string }[];
  createdAt: Date;
  updatedAt: Date;
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
