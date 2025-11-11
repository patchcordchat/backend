import { Schema, model, Types } from 'mongoose';
import { type IServer, IRole } from './server.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const RoleSchema = new Schema<IRole>({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 300,
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
      required: true,
    },
    description: {
      type: String,
      maxLength: 300,
    },
    afk_channel_id: {
      type: Schema.Types.ObjectId,
    },
    afk_timeout: {
      type: Number,
      default: 60,
      enum: [60, 300, 900, 1800, 3600],
    },
    roles: [RoleSchema],
    max_members: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: 'servers',
  },
);

serverSchema.plugin(toJSONPlugin<IServer>());

// Добавление индексов
serverSchema.index({ name: 'text', description: 'text' });

export default model<IServer>('Server', serverSchema);
