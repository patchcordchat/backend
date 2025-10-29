import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import { type IServer, IRole } from './server.types';

const RoleSchema = new Schema<IRole>({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
    alias: 'id',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  hoist: {
    type: Boolean,
    required: true,
    default: false,
  },
  position: {
    type: Number,
    required: true,
  },
  flags: {
    type: Number,
    required: true,
    default: 0,
  },
});

const serverSchema = new Schema<IServer>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      alias: 'id',
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    owner_id: {
      type: Schema.Types.UUID,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    afk_channel_id: {
      type: Schema.Types.UUID,
      required: false,
    },
    afk_timeout: {
      type: Number,
      default: 60,
    },
    roles: [RoleSchema],
    max_members: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true, collection: 'servers' },
);

// Добавление индексов
serverSchema.index({ name: 'text', description: 'text' });

export default model<IServer>('server', serverSchema);
