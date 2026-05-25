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
      trim: true,
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    permissions: {
      type: Number,
      required: true,
      default: RolePermissions.ADMINISTRATOR,
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
    collection: 'roles',
    versionKey: false,
  },
);

roleSchema.plugin(toJSONPlugin<IRole>());

// Добавление индексов
roleSchema.index({ server_id: 1 });

export default model<IRole>('role', roleSchema);
