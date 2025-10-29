import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  server: {
    port: number,
  }
  mongodb: {
    host: string,
    login: string,
    pass: string,
    authdb: string,
    database: string
  }
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  mongodb: {
    host: process.env.MONGO_HOST || '192.168.0.53',
    login: process.env.MONGO_USERNAME || 'patchcord',
    pass: process.env.MONGO_PASSWORD || 'patchcord',
    authdb: process.env.MONGO_AUTH_DATABASE || 'admin',
    database: process.env.MONGO_DATABASE || 'patchcord',
  }
};

export default config;