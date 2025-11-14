import { Schema, model, Types } from 'mongoose';
import { IUserRelationship } from './user-relationship.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const userRelationshipSchema = new Schema<IUserRelationship>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    friend_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
    }
  },
  { timestamps: true, collection: 'user-relationships' },
);

userRelationshipSchema.plugin(toJSONPlugin<IUserRelationship>);

export default model<IUserRelationship>('UserRelationship', userRelationshipSchema);
