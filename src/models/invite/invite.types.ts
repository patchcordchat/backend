import { Types } from 'mongoose';

export enum InviteTypes {
  SERVER = 0,
  GROUP_DM = 1,
  FRIEND = 2,
}

export interface IInvite {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  channel_id: Types.ObjectId;
  inviter_id: Types.ObjectId;
  code: string;
  type: InviteTypes;
  expires_at: number;
  created_at: number;
  updated_at: number;
}
