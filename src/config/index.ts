import dotenv from 'dotenv';
import { type ConnectOptions } from 'mongoose';
import {
  WorkerLogLevel,
  WorkerLogTag,
  RouterRtpCodecCapability,
  TransportListenInfo,
} from 'mediasoup/node/lib/types';

dotenv.config();

interface Config {
  nodeEnv: string;
  app: {
    key: string;
  };
  server: {
    port: number;
  };
  database: {
    mongodb: {
      host: string;
      port: string;
      username: string;
      password: string;
      database: string;
      options?: ConnectOptions | undefined;
    };
    redis: {
      host: string;
      port: number;
    };
  };
  s3: {
    region: string;
    endpoint: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    forcePathStyle: boolean;
    bucket: string;
  };
  mediasoup: {
    worker: {
      rtcMinPort: number;
      rtcMaxPort: number;
      logLevel: WorkerLogLevel;
      logTags: WorkerLogTag[];
    };
    router: {
      mediaCodecs: RouterRtpCodecCapability[];
    };
    webRtcTransport: {
      listenIps: TransportListenInfo[];
      maxIncomingBitrate: number;
      initialAvailableOutgoingBitrate: number;
    };
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    key: process.env.APP_KEY || 'change-me',
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  database: {
    mongodb: {
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT || '27017',
      username: process.env.MONGO_USERNAME || 'patchcord',
      password: process.env.MONGO_PASSWORD || 'patchcord',
      database: process.env.MONGO_DATABASE || 'patchcord',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  },
  s3: {
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || 'change-me',
      secretAccessKey: process.env.S3_SECRET_KEY || 'change-me',
    },
    forcePathStyle: true,
    bucket: process.env.S3_BUCKET || 'patchcord',
  },
  mediasoup: {
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
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: process.env.WEBRTC_ANNOUNCED_IP || '127.0.0.1',
          protocol: 'udp',
        },
      ],
      maxIncomingBitrate: 1500000,
      initialAvailableOutgoingBitrate: 1000000,
    },
  },
};

export default config;
