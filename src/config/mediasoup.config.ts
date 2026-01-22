import {
  WorkerLogLevel,
  WorkerLogTag,
  RouterRtpCodecCapability,
  TransportListenInfo,
} from 'mediasoup/node/lib/types';

interface MediasoupWorkerConfig {
  rtcMinPort: number;
  rtcMaxPort: number;
  logLevel: WorkerLogLevel;
  logTags: WorkerLogTag[];
}

interface MediasoupRouterConfig {
  mediaCodecs: RouterRtpCodecCapability[];
}

interface MediasoupTransportConfig {
  listenIps: TransportListenInfo[];
  maxIncomingBitrate: number;
  initialAvailableOutgoingBitrate: number;
}

export interface IMediasoupConfig {
  worker: MediasoupWorkerConfig;
  router: MediasoupRouterConfig;
  transport: MediasoupTransportConfig;
}

const config: IMediasoupConfig = {
  worker: {
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
    logLevel: 'warn',
    logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
  },
  router: {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
    ],
  },
  transport: {
    listenIps: [
      {
        ip: '0.0.0.0',
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || 'localhost',
        protocol: 'udp',
      },
    ],
    maxIncomingBitrate: 1500000,
    initialAvailableOutgoingBitrate: 1000000,
  },
};

export default config;
