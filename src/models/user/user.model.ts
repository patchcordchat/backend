import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import config from '@/config';
import { hash, compare } from 'bcryptjs';
import { IUser, UserModel, IUserMethods } from './user.types';
import { sign } from 'jsonwebtoken';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
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
    tokens: [{ token: { type: String, required: true } }],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

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

userSchema.methods.toJSON = function () {
  const user = this as IUser;
  const userObject = user.toObject();
  userObject.id = user._id.toString();
  
  [
    '_id',
    'flags',
    'password',
    'tokens',
    '__v',
    'createdAt',
    'updatedAt',
  ].forEach((field) => {
    delete userObject[field];
  });

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
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
