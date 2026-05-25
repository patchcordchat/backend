import { rabbitMQ } from '@/lib/rabbitmq';
import rabbitConfig from '@/config/rabbitmq.config';

export interface EmailPayload {
  to: string;
  subject: string;
  template: string;
  context: object;
}

export const MailService = {
  async queueEmail(data: EmailPayload) {
    const channel = rabbitMQ.getChannel();
    channel.sendToQueue(rabbitConfig.queues.emails, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  },
};
