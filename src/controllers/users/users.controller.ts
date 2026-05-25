import { Request, Response, NextFunction } from 'express';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};
