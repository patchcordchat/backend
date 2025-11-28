import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@/middlewares/auth.middleware';

export const getMe = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const updateMyAccount = (
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

export const updateMyProfile = (
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

export const disableMyAccount = (
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

export const deleteMyAccount = (
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
