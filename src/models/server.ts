import mongoose from 'mongoose';
const { randomUUID } = require('crypto');

const RoleSchema = new mongoose.Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  hoist: {
    type: Boolean,
    required: true,
    default: false,
  },
  position: {
    type: Number,
    required: true,
  },
  flags: {
    type: Number,
    required: true,
    default: 0
  }
});

const serverSchema = new mongoose.Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  owner_id: {
    type: 'UUID',
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  afk_channel_id: {
    type: 'UUID',
    required: false,
  },
  afk_timeout: {
    type: Number,
    default: 60,
  },
  roles: [RoleSchema],
  max_members: {
    type: Number,
    default: 100,
  },
});

export default mongoose.model('server', serverSchema);
