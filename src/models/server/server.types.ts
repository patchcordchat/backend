import { Schema, type Document } from 'mongoose';

export interface IServer extends Document {
  _id: Schema.Types.UUID;
  id: Schema.Types.UUID;
  name: string;
  icon?: string;
  owner_id: Schema.Types.UUID;
  description?: string;
  afk_channel_id?: Schema.Types.UUID;
  afk_timeout: number;
  max_members: number;
  created_at: number;
  updated_at: number;
}
