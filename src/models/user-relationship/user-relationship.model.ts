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
    collection: 'user-relationships',
  },
);

userRelationshipSchema.plugin(toJSONPlugin<IUserRelationship>());

export default model<IUserRelationship>(
  'UserRelationship',
  userRelationshipSchema,
);
