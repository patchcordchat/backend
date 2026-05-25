import { Schema, model, Types } from 'mongoose';
import { IInvite, InviteTypes } from './invite.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const inviteSchema = new Schema<IInvite>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    channel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },
    inviter_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: Number,
      default: InviteTypes.SERVER,
      required: true,
    },
    expires_at: {
      type: Number,
      required: true,
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
    collection: 'invites',
    versionKey: false,
  },
);

inviteSchema.plugin(toJSONPlugin<IInvite>());

// Добавление индексов
inviteSchema.index({ server_id: 1 });

export default model<IInvite>('Invite', inviteSchema);
