type Env = 'development' | 'production';

export interface IAppConfig {
  env: Env;
  port: number;
  secretKey: string;
}

const config: IAppConfig = {
  env: (process.env.NODE_ENV as Env) || 'development',
  port: Number(process.env.SERVER_PORT) || 3000,
  secretKey: process.env.APP_KEY || 'change-me',
};

export default config;
