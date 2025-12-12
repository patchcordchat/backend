import { createServer, type Server } from 'http';
import app from '@/app';
import config from '@/config';
import { initSocket } from './socket';

(async function run() {
  try {
    // Mongoose
    await require('@/lib/mongoose').connect();

    // Server
    const server: Server = createServer(app);

    // Socket
    initSocket(server);

    server.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
