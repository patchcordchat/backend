import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import config from '@/config';

const client = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.credentials.accessKeyId,
    secretAccessKey: config.s3.credentials.secretAccessKey,
  },
});

export const upload = async (key: string, body: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
    Body: body,
    ContentType: 'image/jpeg',
    ACL: ObjectCannedACL.public_read,
  });

  await client.send(command);
};