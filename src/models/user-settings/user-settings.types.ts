import { Schema } from 'mongoose';

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
    _id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    theme: string;
    locale: string;
    status: string;
}