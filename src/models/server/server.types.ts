import { Types, type Document } from 'mongoose';

export interface IServer extends Document {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  name: string;
  icon?: string;
  owner_id: Types.ObjectId;
  description?: string;
  afk_channel_id?: Types.ObjectId;
  afk_timeout: number;
  max_members: number;
  created_at: number;
  updated_at: number;
}
