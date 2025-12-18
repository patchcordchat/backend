import { createWorker } from 'mediasoup';
import { Worker, Router } from 'mediasoup/node/lib/types';
import config from '@/config';

let worker: Worker;

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

  console.log('Mediasoup Worker initialized');
};

export const createRoomRouter = async (): Promise<Router> => {
  const mediaCodecs = config.mediasoup.router.mediaCodecs;
  const router = await worker.createRouter({ mediaCodecs });

  return router;
};