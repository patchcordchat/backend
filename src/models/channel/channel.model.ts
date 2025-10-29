import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import { IChannel } from './channel.types';

const channelSchema = new Schema<IChannel>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      alias: 'id',
    },
    type: {
      type: Number,
      required: true,
      default: 0,
    },
    server_id: {
      type: Schema.Types.UUID,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    last_message_id: {
      type: Schema.Types.UUID,
    },
    user_limit: {
      type: Number,
    },
    owner_id: {
      type: Schema.Types.UUID,
      required: true,
    },
    member_count: {
      type: Number,
      required: true,
      default: 0,
    },
    flags: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, collection: 'channels' },
);

// Добавление индексов
channelSchema.index({ server_id: 1, position: 1 });

export default model<IChannel>('channel', channelSchema);
