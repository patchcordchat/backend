import { Schema, model, Types } from 'mongoose';
import { IFile } from './file.types';
import { toJSONPlugin } from '../plugins/toJSON.plugin';

const fileSchema = new Schema<IFile>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    filename: {
      type: String,
      required: true,
    },
    content_type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    message_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    server_id: {
      type: Schema.Types.ObjectId,
      required: true,
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
    collection: 'files',
    versionKey: false,
  },
);

fileSchema.plugin(toJSONPlugin<IFile>());

const File = model<IFile>('File', fileSchema);

export default File;
