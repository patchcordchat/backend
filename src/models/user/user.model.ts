import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import { IUser } from './user.types';

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      alias: 'id',
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 32,
    },
    global_name: {
      type: String,
      minLength: 1,
      maxLength: 32,
    },
    avatar: {
      type: String,
    },
    bot: {
      type: Boolean,
    },
    pronouns: {
      type: String,
      maxLength: 40,
    },
    bio: {
      type: String,
      default: '',
      maxLength: 190,
    },
    locale: {
      type: String,
      default: 'RU',
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    flags: {
      type: Number,
      default: 0,
      select: false,
    },
    public_flags: {
      type: Number,
      required: true,
      default: 0,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true, collection: 'users' },
);

// Добавление индексов
userSchema.index({ username: 'text', global_name: 'text' });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });

export default model<IUser>('user', userSchema);
