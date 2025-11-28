import { Schema, model, Types } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import {
  IUser,
  UserModel,
  IUserMethods,
  UserFlags,
  UserPublicFlags,
} from './user.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
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
      default: false,
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
      default: UserFlags.NONE,
      private: true,
    },
    public_flags: {
      type: Number,
      default: UserPublicFlags.NONE,
      required: true,
    },
    password: {
      type: String,
      required: true,
      private: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

userSchema.plugin(toJSONPlugin<IUser, UserModel, IUserMethods>());

// Добавление индексов
userSchema.index({ username: 'text', global_name: 'text' });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 8);
  }
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await compare(password, user.password);
  if (!isMatch) return null;
  return user;
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
