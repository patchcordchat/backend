import { Schema } from 'mongoose';

export interface IUserRelationship {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  friend_id: Schema.Types.ObjectId;
  status: string;
  created_at: number;
  updated_at: number;
}
