import { Schema, model, type Document } from 'mongoose';
import { randomUUID } from 'crypto';

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
    },
    last_message_id: {
      type: Schema.Types.UUID,
      required: false,
    },
    user_limit: {
      type: Number,
      required: true,
      default: 100,
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
