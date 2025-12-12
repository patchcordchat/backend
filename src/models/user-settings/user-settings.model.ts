import { Schema, model, Types } from 'mongoose';
import {
  IUserSettings,
  UserStatus,
  UserLocale,
  UserTheme,
} from './user-settings.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const userRolesSchema = new Schema<IUserSettings>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    theme: {
      type: String,
      enum: [UserTheme.DARK, UserTheme.LIGHT],
      default: UserTheme.LIGHT,
    },
    locale: {
      type: String,
      enum: [UserLocale.EN, UserLocale.RU],
      default: UserLocale.RU,
    },
    status: {
      type: String,
      enum: [UserStatus.ONLINE, UserStatus.OFFLINE],
      default: UserStatus.OFFLINE,
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
    collection: 'user-settings',
  },
);

userRolesSchema.plugin(toJSONPlugin<IUserSettings>());

export default model<IUserSettings>('UserSettings', userRolesSchema);
