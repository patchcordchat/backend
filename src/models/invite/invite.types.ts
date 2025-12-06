import { Schema } from 'mongoose';

export enum InviteTypes {
  SERVER = 0,
  GROUP_DM = 1,
  FRIEND = 2,
}

export interface IInvite {
  _id: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  channel_id: Schema.Types.ObjectId;
  inviter_id: Schema.Types.ObjectId;
  code: string;
  type: InviteTypes;
  expires_at: number;
  created_at: number;
  updated_at: number;
}
