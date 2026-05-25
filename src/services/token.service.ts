import crypto from 'crypto';
import appConfig from '@/config/app.config';

/**
 * Генерирует токен
 */
export function generateToken(userId: string): string {
  // Часть 1: User ID в base64
  const userIdBase64 = Buffer.from(userId).toString('base64');

  // Часть 2: Timestamp в base64
  const timestamp = Date.now().toString();
  const timestampBase64 = Buffer.from(timestamp).toString('base64');

  // Часть 3: HMAC подпись
  const dataToSign = `${userIdBase64}.${timestampBase64}`;
  const signature = crypto
    .createHmac('sha256', appConfig.secretKey)
    .update(dataToSign)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${userIdBase64}.${timestampBase64}.${signature}`;
}

export function verifyToken(token: string): { userId: string; timestamp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [userIdBase64, timestampBase64, signature] = parts;

    // Проверяем подпись
    const dataToSign = `${userIdBase64}.${timestampBase64}`;
    const expectedSignature = crypto
      .createHmac('sha256', appConfig.secretKey)
      .update(dataToSign)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignature) {
      return null;
    }

    // Декодируем userId и timestamp
    const userId = Buffer.from(userIdBase64, 'base64').toString('utf-8');
    const timestamp = parseInt(Buffer.from(timestampBase64, 'base64').toString('utf-8'), 10);

    return { userId, timestamp };
  } catch {
    return null;
  }
}

/**
 * Извлекает userId из токена без проверки подписи (для быстрого доступа)
 */
export function extractUserId(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    return Buffer.from(parts[0], 'base64').toString('utf-8');
  } catch {
    return null;
  }
}
