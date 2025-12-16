import { createWorker } from 'mediasoup';
import { Worker, Router } from 'mediasoup/node/lib/types';
import config from '@/config';

let worker: Worker;
let router: Router;

/**
 * Инициализация Mediasoup Worker и Router
 * Вызывается один раз при старте сервера
 */
export const initMediasoup = async () => {
  worker = await createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
  });

  worker.on('died', () => {
    console.error(
      'mediasoup worker died, exiting in 2 seconds... [pid:%d]',
      worker.pid,
    );
    setTimeout(() => process.exit(1), 2000);
  });

  const { mediaCodecs } = config.mediasoup.router;
  router = await worker.createRouter({ mediaCodecs });

  console.log('Mediasoup Worker and Router initialized');
};

/**
 * Получить инстанс роутера для создания транспортов в контроллерах
 */
export const getRouter = (): Router => {
  if (!router)
    throw new Error(
      'Mediasoup router not initialized. Call initMediasoup() first.',
    );
  return router;
};
