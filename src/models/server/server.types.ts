import { Schema, type Document } from 'mongoose';

export interface IServer extends Document {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  name: string;
  icon?: string;
  owner_id: Schema.Types.ObjectId;
  description?: string;
  afk_channel_id?: Schema.Types.ObjectId;
  afk_timeout: number;
  max_members: number;
  created_at: number;
  updated_at: number;
}
