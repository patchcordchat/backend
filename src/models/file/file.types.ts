import { Types } from 'mongoose';

export interface IFile {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
  deleted: boolean;
  message_id: Types.ObjectId;
  user_id: Types.ObjectId;
  server_id: Types.ObjectId;
  created_at: number;
  updated_at: number;
}
