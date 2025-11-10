import { Schema, model, Types } from 'mongoose';
import {
  type IAttachment,
  IReaction,
  IAuthor,
  IMessage,
} from './message.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const attachmentSchema = new Schema<IAttachment>(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    filename: String,
    size: Number,
    url: String,
    proxy_url: String,
    height: Number,
    width: Number,
    content_type: String,
  },
  { _id: false },
);

const reactionSchema = new Schema<IReaction>(
  {
    emoji: String,
    count: Number,
    users: [Schema.Types.UUID],
  },
  { _id: false },
);

const authorSchema = new Schema<IAuthor>(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    username: String,
    discriminator: String,
    avatar: String,
  },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    channel_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    author: authorSchema,
    content: {
      type: String,
      required: true,
      maxLength: 10000,
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
  { timestamps: false, collection: 'messages' },
);

messageSchema.plugin(toJSONPlugin<IMessage>);

// Добавление индексов
messageSchema.index({ channel_id: 1, timestamp: -1 });
messageSchema.index({ timestamp: -1 });
messageSchema.index({ content: 'text' });

export default model<IMessage>('Message', messageSchema);
