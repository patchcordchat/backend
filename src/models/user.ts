import { Schema, model, type Document } from 'mongoose';
import { randomUUID } from 'crypto';

export interface IUser extends Document {
  _id: Schema.Types.UUID;
  id: string;
  username: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  pronouns?: string;
  bio: string;
  locale: string;
  verified: boolean;
  email?: string;
  phone?: string;
  flags: number;
  public_flags: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

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
    },
    global_name: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    bot: {
      type: Boolean,
      required: false,
    },
    pronouns: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: true,
      default: '',
    },
    locale: {
      type: String,
      required: false,
      default: 'RU',
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    flags: {
      type: Number,
      required: true,
      default: 0,
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
userSchema.index({ username: 'text', global_name: 'text'});
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });

export default model<IUser>('user', userSchema);
