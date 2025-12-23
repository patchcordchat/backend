export interface IS3Config {
    region: string;
    endpoint: string;
    accessKey: string;
    secretKey: string;
    forcePathStyle: boolean;
    bucket: string;
}

export const config: IS3Config = {
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
    accessKey: process.env.S3_ACCESS_KEY || 'change-me',
    secretKey: process.env.S3_SECRET_KEY || 'change-me',
    forcePathStyle: true,
    bucket: process.env.S3_BUCKET || 'patchcord',
};

export default config;