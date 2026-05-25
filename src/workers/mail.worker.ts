import nodemailer from 'nodemailer';
import { rabbitMQ } from '@/lib/rabbitmq';
import rabbitConfig from '@/config/rabbitmq.config';
import smtpConfig from '@/config/smtp.config';
import { EmailPayload } from '@/services/mail.service';

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: Number(smtpConfig.port),
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
});

export const startMailWorker = async () => {
  const channel = rabbitMQ.getChannel();

  channel.consume(rabbitConfig.queues.emails, async (msg) => {
    if (msg !== null) {
      const content: EmailPayload = JSON.parse(msg.content.toString());

      try {
        await transporter.sendMail({
          from: '"Patchcord" <noreply@patchcord.com>',
          to: content.to,
          subject: content.subject,
          text: `Hello, this is ${content.template}`,
        });

        channel.ack(msg);
      } catch (error) {
        console.error('Failed to send email:', error);

        channel.nack(msg, false, true);
      }
    }
  });
};
