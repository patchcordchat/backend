import { Schema, model, Types } from 'mongoose';
import { IUserRoles } from './user-roles.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const userRolesSchema = new Schema<IUserRoles>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
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
    collection: 'user-roles',
  },
);

userRolesSchema.plugin(toJSONPlugin<IUserRoles>);

export default model<IUserRoles>('UserRoles', userRolesSchema);
