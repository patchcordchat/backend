import { randomBytes } from 'crypto';

interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

export const processBase64Image = (
  base64String: string,
): ProcessedImage | null => {
  const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    return null;
  }

  const [, extension, data] = matches;

  const buffer = Buffer.from(data, 'base64');

  const contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

  return { buffer, contentType, extension };
};

export const generateFileHash = (): string => {
  return randomBytes(16).toString('hex');
};
