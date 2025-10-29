import{ Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';

const channelSchema = new Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
    alias: 'id'
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

export default model('channel', channelSchema);
