import { Schema } from 'mongoose';

export interface IServerMember {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  server_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  roles: Schema.Types.ObjectId[];
  joined_at: number;
  created_at: number;
  updated_at: number;
}
