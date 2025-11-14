import { Schema, model, Types } from 'mongoose';
import { IRole, RolePermissions } from './role.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const roleSchema = new Schema<IRole>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    server_id: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    permissions: {
      type: Number,
      required: true,
      default: RolePermissions.ADMINISTRATOR,
    },
  },
  { timestamps: true, collection: 'roles' },
);

roleSchema.plugin(toJSONPlugin<IRole>);

// Добавление индексов
roleSchema.index({ server_id: 1 });

export default model<IRole>('role', roleSchema);
