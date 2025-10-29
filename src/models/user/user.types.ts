import { Schema, type Document } from 'mongoose';

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
  createdAt: Date;
  updatedAt: Date;
}