import amqp, { Channel, ChannelModel } from 'amqplib';
import rabbitConfig, { url as rabbitUrl } from '@/config/rabbitmq.config';

class RabbitMQ {
  private connection?: ChannelModel;
  private channel?: Channel;

  async connect() {
    if (this.connection) return;

    this.connection = await amqp.connect(rabbitUrl);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(rabbitConfig.queues.emails, {
      durable: true,
    });

    console.log('connected to RabbitMQ');
  }

  getChannel() {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    return this.channel;
  }
}

export const rabbitMQ = new RabbitMQ();
