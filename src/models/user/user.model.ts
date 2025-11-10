import { Schema, model, Types } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import config from '@/config';
import { IUser, UserModel, IUserMethods } from './user.types';
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
      private: true,
    },
    public_flags: {
      type: Number,
      required: true,
      default: 0,
    },
    password: {
      type: String,
      required: true,
      private: true,
    },
    tokens: {
      type: [{ token: { type: String, required: true } }],
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

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = sign({ _id: user._id.toString() }, config.app.key);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
