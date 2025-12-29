import { Types } from 'mongoose';

export interface IFile {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
  created_at: number;
  updated_at: number;
}
