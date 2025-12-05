import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import User, { IUser } from '@/models/user';

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

    // 3. Загружаем пользователя
    const user = await User.findById(session.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 4. Логика продления сессии (Sliding Expiration)
    const newExpiresAt = await AuthService.refreshSession(sessionId, session);
    if (newExpiresAt) {
      // Обновляем куку, чтобы продлить её жизнь в браузере
      res.cookie('sid', sessionId, {
        httpOnly: true,
        signed: true,
        expires: newExpiresAt,
      });
    }

    req.user = user;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
