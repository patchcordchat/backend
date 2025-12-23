import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import config from '@/config';

const client = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
  forcePathStyle: config.s3.forcePathStyle,
});

export const uploadFile = async (
  key: string,
  body: Buffer,
  contentType: string,
) => {
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: ObjectCannedACL.public_read,
  });

  await client.send(command);
};

export const deleteFile = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });

  await client.send(command);
};
