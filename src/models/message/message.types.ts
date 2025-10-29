import { Schema, type Document } from 'mongoose';

export interface IAttachment {
  id: Schema.Types.UUID;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
  content_type?: string;
}

export interface IReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface IAuthor {
  id: Schema.Types.UUID;
  username: string;
  discriminator?: string;
  avatar?: string;
}

export interface IMessage extends Document {
  _id: Schema.Types.UUID;
  id: Schema.Types.UUID;
  channel_id: Schema.Types.UUID;
  author: IAuthor;
  content: string;
  timestamp: number;
  edited_timestamp: number | null;
  tts: boolean;
  attachments: IAttachment[];
  reactions: IReaction[];
  pinned: boolean;
  type: number;
  flags: number;
  createdAt: Date;
  updatedAt: Date;
}