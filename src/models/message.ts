import { Schema, model, type Document } from 'mongoose';
import { randomUUID } from 'crypto';

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

const attachmentSchema = new Schema<IAttachment>({
  id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
  },
  filename: String,
  size: Number,
  url: String,
  proxy_url: String,
  height: Number,
  width: Number,
  content_type: String,
}, { _id: false });

const reactionSchema = new Schema<IReaction>({
  emoji: String,
  count: Number,
  users: [Schema.Types.UUID],
}, { _id: false });

const authorSchema = new Schema<IAuthor>({
  id: {
    type: Schema.Types.UUID,
    required: true,
  },
  username: String,
  discriminator: String,
  avatar: String,
}, { _id: false });

const messageSchema = new Schema<IMessage>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      alias: 'id',
    },
    channel_id: {
      type: Schema.Types.UUID,
      required: true,
    },
    author: {},
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: new Date().getTime(),
    },
    edited_timestamp: {
      type: Number,
      default: null,
    },
    tts: {
      type: Boolean,
      default: false,
    },
    attachments: [attachmentSchema],
    reactions: [reactionSchema],
    pinned: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 0,
    },
    flags: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: 'messages' },
);

// Добавление индексов
messageSchema.index({ channel_id: 1, timestamp: -1 });
messageSchema.index({ timestamp: -1 });
messageSchema.index({ content: 'text' });

export default model<IMessage>('message', messageSchema);
