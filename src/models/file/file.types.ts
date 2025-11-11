import { Schema } from 'mongoose';

export interface IFile {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
  deleted: boolean;
  message_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  server_id: Schema.Types.ObjectId;
}
