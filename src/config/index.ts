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
  s3: {
    region: string;
    endpoint: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    forcePathStyle: boolean;
    bucket: string;
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
  s3: {
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || 'change-me',
      secretAccessKey: process.env.S3_SECRET_KEY || 'change-me',
    },
    forcePathStyle: true,
    bucket: process.env.S3_BUCKET || 'patchcord',
  }
};

export default config;
