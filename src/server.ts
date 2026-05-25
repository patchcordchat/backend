import { createServer, type Server } from 'http';
import app from '@/app';
import config from '@/config';
import { initSocket } from './socket';
import { initMongoose } from './lib/mongoose';
import { initMediasoup } from './lib/mediasoup';
import { rabbitMQ } from '@/lib/rabbitmq';
import { startMailWorker } from '@/workers/mail.worker';

(async function run() {
  try {
    // Mongoose
    await initMongoose();

    // Mediasoup
    await initMediasoup();

    // RabbitMQ
    await rabbitMQ.connect();
    await startMailWorker();

    // Server
    const server: Server = createServer(app);

    // Socket
    initSocket(server);

    server.listen(config.app.port, () => {
      console.log(`Server running on port ${config.app.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
