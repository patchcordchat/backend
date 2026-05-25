import { Types, Document } from 'mongoose';

export interface ISession extends Document {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  user_id: Types.ObjectId;
  token: string;
  client_info: {
    os: string;
    platform: string;
    ip: string;
  };
  expires_at: number;
  last_active: number;
  created_at: number;
  updated_at: number;
  _ttl: Date;
}
