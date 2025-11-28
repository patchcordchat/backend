import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@/middlewares/auth.middleware';
import { AuthService } from '@/services/auth.service';
import { ApiError } from '@/middlewares/error.middleware';
import User from '@/models/user';

const setSessionCookie = (res: Response, sessionId: string, expiresAt: Date) => {
  res.cookie('sid', sessionId, {
    httpOnly: true,
    signed: true,
    expires: expiresAt,
    sameSite: 'lax', 
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError('Missing fields', 400);

    const user = await User.findByCredentials(email, password);
    if (!user) throw new ApiError('Invalid credentials', 401);

    // Создаем сессию
    const ip = req.ip || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    
    const { sessionId, expiresAt } = await AuthService.createSession(
        user._id.toString(), 
        ip, 
        userAgent
    );

    // Ставим куку
    setSessionCookie(res, sessionId, expiresAt);

    // Возвращаем юзера (без токена в теле ответа, он теперь в httpOnly куке)
    res.json({ user });
  } catch (e) {
    next(e);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw new ApiError('Email exists', 409);

    const newUser = new User(req.body);
    await newUser.save();

    // Сразу логиним после регистрации
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    const { sessionId, expiresAt } = await AuthService.createSession(
        newUser._id.toString(), 
        ip, 
        userAgent
    );

    setSessionCookie(res, sessionId, expiresAt);

    res.status(201).json({ user: newUser });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (req.sessionId) {
      await AuthService.deleteSession(req.sessionId);
    }
    
    res.clearCookie('sid');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (e) {
    next(e);
  }
};

export const registerByPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const validatePasswordStrength = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const revertAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};
