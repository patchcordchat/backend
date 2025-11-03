import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@/middlewares/auth.middleware';
import User, { IUser } from '@/models/user';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {  
  const userData: Partial<IUser> = {
    email: req.body.email,
    password: req.body.password,
  };

  if (!userData.email || !userData.password) {
    return {
      error: 'Please provide all the required fields',
    };
  }

  const existingUser = await User.findByCredentials(
    userData.email,
    userData.password,
  );
  if (!existingUser) {
    return null;
  }

  const token = await existingUser.generateAuthToken();
  res.json({ user: existingUser, token });
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
    return {
      error: 'Please provide all the required fields',
    };
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return {
      error: 'User with that email already exists.',
    };
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

  return res.status(200).json({
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
