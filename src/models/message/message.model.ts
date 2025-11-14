import { Schema, model, Types } from 'mongoose';
import type { IReaction, IMessage } from './message.types';
import { MessageTypes } from './message.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const reactionSchema = new Schema<IReaction>(
  {
    emoji: String,
    count: Number,
    users: [Schema.Types.UUID],
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
      ref: 'Channel',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    attachments: [{
      type: Schema.Types.ObjectId,
      ref: 'File',
    }],
    reactions: [reactionSchema],
    pinned: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: MessageTypes.DEFAULT,
      required: true,
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
