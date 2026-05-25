import { Types } from 'mongoose';

export interface IBan {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  server_id: Types.ObjectId;
  user_id: Types.ObjectId;
  reason: string;
  banned_at: number;
  created_at: number;
  updated_at: number;
}
