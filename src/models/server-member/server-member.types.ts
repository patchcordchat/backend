import { Types } from 'mongoose';

export interface IServerMember {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  server_id: Types.ObjectId;
  user_id: Types.ObjectId;
  roles: Types.ObjectId[];
  joined_at: number;
  created_at: number;
  updated_at: number;
}
