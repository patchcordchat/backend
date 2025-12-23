import appConfig, { type IAppConfig } from './app.config';
import dbConfig, { type IDbConfig } from './db.config';
import s3Config, { type IS3Config } from './s3.config';
import mediasoupConfig, { type IMediasoupConfig } from './mediasoup.config';

interface Config {
  app: IAppConfig;
  db: IDbConfig;
  s3: IS3Config;
  mediasoup: IMediasoupConfig;
}

export const config: Config = {
  app: appConfig,
  db: dbConfig,
  s3: s3Config,
  mediasoup: mediasoupConfig,
};

export default config;
