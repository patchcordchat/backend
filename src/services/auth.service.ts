import crypto from 'crypto';
import Session, { type ISession } from '@/models/session';
import redis from '@/lib/ioredis';
import { UAParser } from 'ua-parser-js';
import { generateToken, verifyToken } from './token.service';

const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
const REDIS_TTL_SECONDS = 24 * 60 * 60; // То же самое в секундах для Redis

/**
 * Создать новую сессию и вернуть токен
 */
export async function createSession(userId: string, ip: string, userAgent: string) {
  const parser = new UAParser(userAgent);

  const os = `${parser.getOS().name || 'Unknown'} ${parser.getOS().version || ''}`.trim();
  const platform =
    `${parser.getBrowser().name || 'Unknown'} ${parser.getBrowser().version || ''}`.trim();

  // Генерируем session ID для внутреннего использования
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Генерируем токен в стиле Discord
  const token = generateToken(userId);

  const expiresAt = Date.now() + SESSION_TTL;

  const sessionData = {
    id: sessionId,
    user_id: userId,
    token, // Сохраняем токен в сессии
    client_info: {
      os,
      platform,
      ip,
    },
    user_agent: userAgent,
    expires_at: expiresAt,
    last_active: Date.now(),
  };

  // 1. Сохраняем в MongoDB
  const session = await Session.create(sessionData);

  // 2. Сохраняем в Redis по токену
  await redis.set(`token:${token}`, JSON.stringify(session), 'EX', REDIS_TTL_SECONDS);

  return { token, expiresAt };
}

/**
 * Получить сессию по токену
 */
export async function getSession(token: string): Promise<ISession | null> {
  // Проверяем валидность токена
  const verified = verifyToken(token);
  if (!verified) {
    return null;
  }

  const redisKey = `token:${token}`;

  // 1. Пытаемся найти в Redis
  const cachedSession = await redis.get(redisKey);
  if (cachedSession) {
    const session = JSON.parse(cachedSession) as ISession;

    // Проверяем срок действия
    if (session.expires_at < Date.now()) {
      await deleteSession(token);
      return null;
    }

    return session;
  }

  // 2. Если нет в Redis, ищем в MongoDB
  const session = await Session.findOne({ token });

  if (session) {
    // Проверяем, не истекла ли она
    if (session.expires_at < Date.now()) {
      await deleteSession(token);
      return null;
    }

    // 3. Если нашли в базе - кладем в Redis
    const ttl = Math.ceil((session.expires_at - Date.now()) / 1000);
    if (ttl > 0) {
      await redis.set(redisKey, JSON.stringify(session), 'EX', ttl);
    }
    return session;
  }

  return null;
}

/**
 * Продлить сессию
 */
export async function refreshSession(session: ISession) {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  if (session.expires_at - now < SESSION_TTL - ONE_HOUR) {
    const newExpiresAt = now + SESSION_TTL;

    // Обновляем в Mongo
    await Session.updateOne({ id: session.id }, { expires_at: newExpiresAt, last_active: now });

    // Обновляем объект в памяти
    session.expires_at = newExpiresAt;
    session.last_active = now;

    // Обновляем в Redis
    await redis.set(`token:${session.token}`, JSON.stringify(session), 'EX', REDIS_TTL_SECONDS);

    return newExpiresAt;
  }
  return null;
}

/**
 * Удалить сессию по токену
 */
export async function deleteSession(token: string) {
  await redis.del(`token:${token}`);
  await Session.deleteOne({ token });
}

/**
 * Удалить все сессии пользователя (например, при смене пароля)
 */
export async function deleteAllUserSessions(userId: string) {
  const sessions = await Session.find({ user_id: userId });

  // Удаляем все токены из Redis
  const pipeline = redis.pipeline();
  sessions.forEach((session) => {
    pipeline.del(`token:${session.token}`);
  });
  await pipeline.exec();

  // Удаляем все сессии из MongoDB
  await Session.deleteMany({ user_id: userId });
}
