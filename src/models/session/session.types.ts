import { Types, Document } from 'mongoose';

export interface ISession extends Document {
  id: string;
  user_id: Types.ObjectId;
  ip: string;
  user_agent: string;
  expires_at: number;
  last_active: number;
  created_at: number;
  updated_at: number;
  _ttl: Date;
}
