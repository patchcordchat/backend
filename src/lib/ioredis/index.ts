import Redis from 'ioredis';
import config from '@/config';

const { host, port } = config.database.redis;

const redis = new Redis(port, host);

export default redis;
