import dotenv from 'dotenv';
import {type ConnectOptions} from 'mongoose'

dotenv.config();

interface Config {
  nodeEnv: string;
  server: {
    port: number,
  }
  database: {
    mongodb: {
      host: string,
      port: string,
      username: string,
      password: string,
      database: string,
      options?: ConnectOptions | undefined
    }
  }
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  database: {
    mongodb: {
      host: process.env.MONGO_HOST || '192.168.0.53',
      port: process.env.MONGO_PORT || '27017',
      username: process.env.MONGO_USERNAME || 'patchcord',
      password: process.env.MONGO_PASSWORD || 'patchcord',
      database: process.env.MONGO_DATABASE || 'patchcord',
    }
  }
};

export default config;