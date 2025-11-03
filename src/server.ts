import app from '@/app';
import config from '@/config/config';

(async function run() {
  // Mongoose
  await require('@/lib/mongoose').connect();

  // Server
  app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
})();
