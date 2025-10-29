import mongoose from 'mongoose';
const { randomUUID } = require('crypto');

const userSchema = new mongoose.Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID()
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  discriminator: {
    type: Number,
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
    default: 'RU'
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
  },
  flags : {
    type: Number,
    required: true,
    default: 0
  },
  public_flags: {
    type: Number,
    required: true,
    default: 0
  }
});

export default mongoose.model('user', userSchema);
