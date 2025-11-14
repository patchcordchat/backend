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
    joined_at: {
      type: Date,
      required: true,
      default: new Date(),
    }
  },
  { timestamps: true, collection: 'server-members' },
);

serverMemberSchema.plugin(toJSONPlugin<IServerMember>);

// Добавление индексов
serverMemberSchema.index({ server_id: 1 });

export default model<IServerMember>('serverMember', serverMemberSchema);
