import { Request, Response, NextFunction } from 'express';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { createSession, deleteSession } from '@/services/auth.service';
import { UnauthorizedError, ApiError } from '@/errors';
import User from '@/models/user';

export const login = async (
  req: ValidatedRequest<unknown, unknown, typeof loginSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    if (!user) throw new UnauthorizedError('Invalid login or password');

    // Создаем сессию
    const ip = req.ip || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const { token } = await createSession(user._id.toString(), ip, userAgent);

    // Возвращаем токен
    res.json({
      user_id: user._id,
      token,
    });
  } catch (e) {
    next(e);
  }
};

export const register = async (
  req: ValidatedRequest<unknown, unknown, typeof registerSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw new ApiError('Email already exists', 409);

    const newUser = new User(req.body);
    await newUser.save();

    // Создаем сессию
    const ip = req.ip || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const { token } = await createSession(newUser._id.toString(), ip, userAgent);

    // Возвращаем токен
    res.json({
      user_id: newUser._id,
      token,
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session?.token) {
      await deleteSession(req.session.token);
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (e) {
    next(e);
  }
};

export const registerByPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (e) {
    next(e);
  }
};

export const validatePasswordStrength = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (e) {
    next(e);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (e) {
    next(e);
  }
};

export const revertAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (e) {
    next(e);
  }
};
