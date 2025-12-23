import { Types } from 'mongoose';

export interface IUserRelationship {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  user_id: Types.ObjectId;
  friend_id: Types.ObjectId;
  status: string;
  created_at: number;
  updated_at: number;
}
