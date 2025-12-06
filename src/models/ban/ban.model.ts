import { Schema, model, Types } from 'mongoose';
import { IBan } from './ban.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const banSchema = new Schema<IBan>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    server_id: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    banned_at: {
      type: Number,
      required: true,
      default: Date.now,
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
    collection: 'bans',
    versionKey: false,
  },
);

banSchema.plugin(toJSONPlugin<IBan>);

// Добавление индексов
banSchema.index({ server_id: 1 });

export default model<IBan>('Ban', banSchema);
