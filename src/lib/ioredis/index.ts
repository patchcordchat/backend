import Redis from 'ioredis';
import config from '@/config';

const { host, port } = config.db.redis;

const redis = new Redis(port, host);

export default redis;
