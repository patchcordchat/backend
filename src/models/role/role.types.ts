import { Types } from 'mongoose';

export enum RolePermissions {
  NONE = 0,
  CREATE_INSTANT_INVITE = 1 << 0,
  KICK_MEMBERS = 1 << 1,
  BAN_MEMBERS = 1 << 2,
  ADMINISTRATOR = 1 << 3,
  MANAGE_CHANNELS = 1 << 4,
  MANAGE_SERVER = 1 << 5,
  ADD_REACTIONS = 1 << 6,
  SEND_MESSAGES = 1 << 7,
  SEND_TTS_MESSAGES = 1 << 8,
  MANAGE_MESSAGES = 1 << 9,
  ATTACH_FILES = 1 << 10,
  MENTION_EVERYONE = 1 << 11,
  MUTE_MEMBERS = 1 << 12,
  DEAFEN_MEMBERS = 1 << 13,
  MANAGE_ROLES = 1 << 14,
  MANAGE_WEBHOOKS = 1 << 15,
  USE_SOUNDBOARD = 1 << 16,
  SEND_VOICE_MESSAGES = 1 << 17,
  PIN_MESSAGES = 1 << 18,
  CONNECT = 1 << 19,
  SPEAK = 1 << 20,
}

export interface IRole {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  server_id: Types.ObjectId;
  name: string;
  permissions: RolePermissions;
  created_at: number;
  updated_at: number;
}
