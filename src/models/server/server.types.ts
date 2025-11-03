import { Schema, type Document } from 'mongoose';

export interface IRole {
  _id: Schema.Types.UUID,
  id: string;
  name: string;
  description?: string;
  hoist: boolean;
  position: number;
  flags: number;
}

export interface IServer extends Document {
  _id: Schema.Types.UUID,
  id: Schema.Types.UUID;
  name: string;
  icon?: string;
  owner_id: Schema.Types.UUID;
  description?: string;
  afk_channel_id?: Schema.Types.UUID;
  afk_timeout: number;
  roles: IRole[];
  max_members: number;
  createdAt: Date;
  updatedAt: Date;
}
