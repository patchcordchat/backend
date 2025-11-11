import { Schema, type Document } from 'mongoose';

export interface IReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface IMessage extends Document {
  _id: Schema.Types.UUID;
  id: Schema.Types.UUID;
  channel_id: Schema.Types.UUID;
  author: Schema.Types.UUID;
  content: string;
  timestamp: number;
  edited_timestamp: number | null;
  tts: boolean;
  attachments: Schema.Types.UUID[];
  reactions: IReaction[];
  pinned: boolean;
  type: number;
  flags: number;
  createdAt: Date;
  updatedAt: Date;
}