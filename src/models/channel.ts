import mongoose from 'mongoose';
const { randomUUID } = require('crypto');

const channelSchema = new mongoose.Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
  },
  type: {
    type: Number,
    required: true,
    default: 0,
  },
  server_id: {
    type: 'UUID',
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  last_message_id: {
    type: 'UUID',
    required: false,
  },
  user_limit: {
    type: Number,
    required: true,
    default: 100,
  },
  owner_id: {
    type: 'UUID',
    required: true,
  },
  member_count: {
    type: Number,
    required: true,
    default: 0,
  },
  flags: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model('channel', channelSchema);
