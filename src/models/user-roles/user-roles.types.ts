import { Schema } from 'mongoose';

export interface IUserRoles {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  role_id: Schema.Types.ObjectId;
  created_at: number;
  updated_at: number;
}
