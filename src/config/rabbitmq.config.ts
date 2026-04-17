export interface IRabbitmqConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  queues: Record<string, string>;
}

const config: IRabbitmqConfig = {
  host: process.env.RABBITMQ_HOST || 'localhost',
  port: process.env.RABBITMQ_PORT || '5672',
  username: process.env.RABBITMQ_USER || 'guest',
  password: process.env.RABBITMQ_PASS || 'guest',
  queues: {
    emails: 'email_queue',
  },
};

export const url = `amqp://${config.username}:${config.password}@${config.host}:${config.port}`;

export default config;
