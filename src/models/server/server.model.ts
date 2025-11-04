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
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      alias: 'id',
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
      type: Schema.Types.UUID,
      required: true,
    },
    description: {
      type: String,
      maxLength: 300,
    },
    afk_channel_id: {
      type: Schema.Types.UUID,
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

serverSchema.methods.toJSON = function () {
  const server = this as IServer;
  const serverObject = server.toObject();
  serverObject.id = server._id.toString();
  serverObject.owner_id = server.owner_id.toString();

  [
    '_id',
    '__v',
    'createdAt',
    'updatedAt',
  ].forEach((field) => {
    delete serverObject[field];
  });

  return serverObject;
};

// Добавление индексов
serverSchema.index({ name: 'text', description: 'text' });

export default model<IServer>('server', serverSchema);
