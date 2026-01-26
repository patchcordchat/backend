import { Request, Response, NextFunction } from 'express';
import { getSession, refreshSession } from '@/services/auth.service';
import { UnauthorizedError } from '@/errors';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Получаем токен из заголовка Authorization
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedError();
    }

    // 2. Ищем сессию через сервис
    const session = await getSession(token);

    if (!session) {
      throw new UnauthorizedError();
    }

    // 3. Продление сессии
    await refreshSession(session);

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
