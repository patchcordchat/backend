import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Получаем sessionId из подписанной куки
    const sessionId = req.signedCookies['sid'] || req.cookies['sid'];

    if (!sessionId) {
      throw new Error('Authentication failed: Session missing');
    }

    // 2. Ищем сессию через сервис
    const session = await AuthService.getSession(sessionId);

    if (!session) {
      // Если кука есть, а сессии нет - чистим куку
      res.clearCookie('sid');
      throw new Error('Authentication failed: Invalid session');
    }

    // 4. Логика продления сессии (Sliding Expiration)
    const newExpiresAt = await AuthService.refreshSession(session);
    if (newExpiresAt) {
      // Обновляем куку, чтобы продлить её жизнь в браузере
      res.cookie('sid', session.id, {
        httpOnly: true,
        signed: true,
        expires: new Date(newExpiresAt),
      });
    }

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
