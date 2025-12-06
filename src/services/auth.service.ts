import crypto from 'crypto';
import Session, { type ISession } from '@/models/session';
import redis from '@/lib/ioredis';
import { UAParser } from 'ua-parser-js';

const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
const REDIS_TTL_SECONDS = 24 * 60 * 60; // То же самое в секундах для Redis

export class AuthService {
  /**
   * Создать новую сессию
   */
  static async createSession(userId: string, ip: string, userAgent: string) {
    const parser = new UAParser(userAgent);

    const os = `${parser.getOS().name || 'Unknown'} ${parser.getOS().version || ''}`.trim();
    const platform = `${parser.getBrowser().name || 'Unknown'} ${parser.getBrowser().version || ''}`.trim();

    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_TTL;

    const sessionData = {
      id: sessionId,
      user_id: userId,
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

    // 2. Сохраняем в Redis
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(session),
      'EX',
      REDIS_TTL_SECONDS,
    );

    return { sessionId, expiresAt };
  }

  /**
   * Получить сессию
   */
  static async getSession(sessionId: string): Promise<ISession | null> {
    const redisKey = `session:${sessionId}`;

    // 1. Пытаемся найти в Redis
    const cachedSession = await redis.get(redisKey);
    if (cachedSession) {
      const session = JSON.parse(cachedSession) as ISession;
      return session;
    }

    // 2. Если нет в Redis, ищем в MongoDB
    const session = await Session.findOne({ sessionId });

    if (session) {
      // Проверяем, не истекла ли она
      if (session.expires_at < Date.now()) {
        await Session.deleteOne({ sessionId });
        return null;
      }

      // 3. Если нашли в базе - кладем в Redis
      // Вычисляем оставшееся время жизни для Redis
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
  static async refreshSession(session: ISession) {
    const now = Date.now();
    // Продлеваем, только если прошёл 1 час с последнего обновления
    const ONE_HOUR = 60 * 60 * 1000;

    if (session.expires_at - now < SESSION_TTL - ONE_HOUR) {
      const newExpiresAt = now + SESSION_TTL;

      // Обновляем в Mongo
      await Session.updateOne(
        { id: session.id },
        { expires_at: newExpiresAt, last_active: new Date() },
      );

      // Обновляем объект в памяти для Redis
      session.expires_at = newExpiresAt;
      session.last_active = Date.now();

      // Обновляем в Redis
      await redis.set(
        `session:${session.id}`,
        JSON.stringify(session),
        'EX',
        REDIS_TTL_SECONDS,
      );

      return newExpiresAt; // Возвращаем новую дату для обновления куки
    }
    return null; // Обновление не требуется
  }

  /**
   * Удалить сессию
   */
  static async deleteSession(sessionId: string) {
    await redis.del(`session:${sessionId}`);
    await Session.deleteOne({ sessionId });
  }
}
