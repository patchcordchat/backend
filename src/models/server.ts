import{ Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';

const RoleSchema = new Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
    alias: 'id'
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

const serverSchema = new Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
    alias: 'id'
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

export default model('server', serverSchema);
