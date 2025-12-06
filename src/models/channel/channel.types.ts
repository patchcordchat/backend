import { Schema, type Document } from 'mongoose';

export enum ChannelTypes {
  TEXT = 0,
  VOICE = 1,
  DM = 2,
  GROUP_DM = 3,
}

export enum ChannelFlags {
  NONE = 0,
  PINNED = 1 << 0,
  IS_SPAM = 1 << 1,
}

export interface IChannel extends Document {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  type: ChannelTypes;
  server_id: Schema.Types.ObjectId;
  position: number;
  name: string;
  last_message_id?: string;
  user_limit: number;
  owner_id: Schema.Types.ObjectId;
  member_count: number;
  flags: ChannelFlags;
  created_at: number;
  updated_at: number;
}
