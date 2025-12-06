import { Schema, model, Types } from 'mongoose';
import { type IServer } from './server.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const serverSchema = new Schema<IServer>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    icon: {
      type: String,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      maxLength: 300,
    },
    afk_channel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },
    afk_timeout: {
      type: Number,
      default: 60,
      enum: [60, 300, 900, 1800, 3600],
    },
    max_members: {
      type: Number,
    },
    created_at: {
      type: Number,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Number,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'servers',
    versionKey: false,
  },
);

serverSchema.plugin(toJSONPlugin<IServer>());

// Добавление индексов
serverSchema.index({ name: 'text', description: 'text' });

export default model<IServer>('Server', serverSchema);
