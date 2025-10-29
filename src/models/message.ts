import{ Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';

const channelSchema = new Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID(),
    alias: 'id'
  },
  channel_id: {
    type: 'UUID',
    required: true,
  },
  author: {},
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    default: new Date().getTime(),
  },
  edited_timestamp: {
    type: Number,
    default: null,
  },
  tts: {
    type: Boolean,
    default: false,
  },
  attachments: Array, //todo дописать Scheme для attachment
  reactions: Array, //todo дописать Scheme для reaction
  pinned: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Boolean,
    default: 0,
  },
  flags: {
    type: Number,
    default: 0,
  }
});

export default model('channel', channelSchema);
