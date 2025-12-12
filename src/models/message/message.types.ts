import { Schema, type Document } from 'mongoose';

export enum MessageTypes {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  USER_JOIN = 7,
  REPLY = 8,
  CHAT_INPUT_COMMAND = 9,
}

export enum MessageFlags {
  NONE = 0,
  PINNED = 1 << 0,
  LOADING = 1 << 1,
  IS_VOICE_MESSAGE = 1 << 2,
}

export interface IReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface IMessage extends Document {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  channel_id: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
  timestamp: number;
  edited_timestamp: number | null;
  tts: boolean;
  attachments: Schema.Types.ObjectId[];
  reactions: IReaction[];
  pinned: boolean;
  type: MessageTypes;
  flags: number;
  created_at: number;
  updated_at: number;
}