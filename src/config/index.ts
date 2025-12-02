import dotenv from 'dotenv';
import { type ConnectOptions } from 'mongoose';

dotenv.config();

interface Config {
  nodeEnv: string;
  app: {
    key: string;
  };
  server: {
    port: number;
  };
  database: {
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
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    key: process.env.APP_KEY || 'change-me',
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  database: {
    mongodb: {
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT || '27017',
      username: process.env.MONGO_USERNAME || 'patchcord',
      password: process.env.MONGO_PASSWORD || 'patchcord',
      database: process.env.MONGO_DATABASE || 'patchcord',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  },
};

export default config;
