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
      type: Date,
      required: true,
    }
  },
  { timestamps: true, collection: 'invites' },
);

inviteSchema.plugin(toJSONPlugin<IInvite>);

// Добавление индексов
inviteSchema.index({ server_id: 1 });

export default model<IInvite>('Invite', inviteSchema);
