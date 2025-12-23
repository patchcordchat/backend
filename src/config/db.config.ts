import { type ConnectOptions } from 'mongoose';

export interface IDbConfig {
  mongodb: {
    host: string;
    port: string;
    username: string;
    password: string;
    database: string;
    options?: ConnectOptions | undefined;
  };
  redis: {
    host: string;
    port: number;
  };
}

const config: IDbConfig = {
  mongodb: {
    host: process.env.MONGO_HOST || 'mongodb',
    port: process.env.MONGO_PORT || '27017',
    username: process.env.MONGO_USERNAME || 'patchcord',
    password: process.env.MONGO_PASSWORD || 'change-me',
    database: process.env.MONGO_DATABASE || 'patchcord',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
};

export default config;
