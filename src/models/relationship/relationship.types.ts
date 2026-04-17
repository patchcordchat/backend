import { Types } from 'mongoose';

export const RELATIONSHIP_TYPES = {
  NONE: 0,
  FRIEND: 1,
  BLOCKED: 2,
  INCOMING_REQUEST: 3,
  OUTGOING_REQUEST: 4,
  IMPLICIT: 5,
  SUGGESTION: 6,
};

export interface IRelationship {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  user_id: Types.ObjectId;
  target_id: Types.ObjectId;
  type: number;
  nickname: string;
  created_at: number;
  updated_at: number;
}
