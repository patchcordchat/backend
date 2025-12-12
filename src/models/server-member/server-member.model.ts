import { Schema, model, Types } from 'mongoose';
import { IServerMember } from './server-member.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const serverMemberSchema = new Schema<IServerMember>(
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
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
    joined_at: {
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
    collection: 'server-members',
    versionKey: false,
  },
);

serverMemberSchema.plugin(toJSONPlugin<IServerMember>);

// Добавление индексов
serverMemberSchema.index({ server_id: 1 });

export default model<IServerMember>('serverMember', serverMemberSchema);
