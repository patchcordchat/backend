import appConfig, { type IAppConfig } from './app.config';
import dbConfig, { type IDbConfig } from './db.config';
import s3Config, { type IS3Config } from './s3.config';
import mediasoupConfig, { type IMediasoupConfig } from './mediasoup.config';
import rabbitmqConfig, { type IRabbitmqConfig } from './rabbitmq.config';
import smtpConfig, { type ISMTPConfig } from './smtp.config';

interface Config {
  app: IAppConfig;
  db: IDbConfig;
  s3: IS3Config;
  mediasoup: IMediasoupConfig;
  rabbitmq: IRabbitmqConfig;
  smtp: ISMTPConfig;
}

export const config: Config = {
  app: appConfig,
  db: dbConfig,
  s3: s3Config,
  mediasoup: mediasoupConfig,
  rabbitmq: rabbitmqConfig,
  smtp: smtpConfig,
};

export default config;
