import { Schema, type Document } from 'mongoose';

export interface IChannel extends Document {
  _id: Schema.Types.UUID;
  id: Schema.Types.UUID;
  type: number;
  server_id: Schema.Types.UUID;
  position: number;
  name: string;
  last_message_id?: string;
  user_limit: number;
  owner_id: Schema.Types.UUID;
  member_count: number;
  flags: number;
  createdAt: Date;
  updatedAt: Date;
}
