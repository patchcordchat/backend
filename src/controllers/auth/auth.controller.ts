import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@/middlewares/auth.middleware';
import { ApiError } from '@/middlewares/error.middleware';
import User, { IUser } from '@/models/user';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData: Partial<IUser> = {
      email: req.body?.email,
      password: req.body?.password,
    };
  
    if (!userData.email || !userData.password) {
      throw new ApiError('Please provide all the required fields', 400);
    }
  
    const existingUser = await User.findByCredentials(
      userData.email,
      userData.password,
    );
    if (!existingUser) {
      throw new ApiError('User not found', 404);
    }
  
    const token = await existingUser.generateAuthToken();
    res.json({ user: existingUser, token });
  } catch (error) {
    next(error)
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userData: Partial<IUser> = {
    username: req.body.username,
    global_name: req.body.global_name,
    email: req.body.email,
    password: req.body.password,
  };

  if (!userData.username || !userData.email || !userData.password) {
    throw new ApiError('Please provide all the required fields.', 400);
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError('User with that email already exists.', 409);
  }

  try {
    const newUser = new User({
      username: userData.username,
      global_name: userData.global_name,
      email: userData.email,
      password: userData.password,
    });

    await newUser.save();

    const token = await newUser.generateAuthToken();

    res.json({ user: newUser, token });
  } catch (err) {
    next(err);
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

export const logout = async (req: CustomRequest, res: Response) => {
  if (req.user) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
  }

  return res.clearCookie('access_token').status(200).json({
    message: 'User logged out successfully.',
  });
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
