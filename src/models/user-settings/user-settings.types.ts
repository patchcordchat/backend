import { Types } from 'mongoose';

export enum UserStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
}

export enum UserLocale {
  EN = 'en',
  RU = 'ru',
}

export enum UserTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface IUserSettings {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  theme: string;
  locale: string;
  status: string;
  created_at: number;
  updated_at: number;
}
