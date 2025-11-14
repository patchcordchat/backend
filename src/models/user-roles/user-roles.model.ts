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
  },
  { timestamps: true, collection: 'user-roles' },
);

userRolesSchema.plugin(toJSONPlugin<IUserRoles>);

export default model<IUserRoles>('UserRoles', userRolesSchema);
