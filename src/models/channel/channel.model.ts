import { Schema, model, Types } from 'mongoose';
import { IChannel, ChannelTypes, ChannelFlags } from './channel.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const channelSchema = new Schema<IChannel>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    type: {
      type: Number,
      required: true,
      default: ChannelTypes.TEXT,
    },
    server_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    last_message_id: {
      type: Schema.Types.ObjectId,
    },
    user_limit: {
      type: Number,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
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
      default: ChannelFlags.NONE,
    },
    created_at: {
      type: Number,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Number,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'channels',
    versionKey: false,
  },
);

channelSchema.plugin(toJSONPlugin<IChannel>);

// Добавление индексов
channelSchema.index({ server_id: 1, position: 1 });

export default model<IChannel>('Channel', channelSchema);
