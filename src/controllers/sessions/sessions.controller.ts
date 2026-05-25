import { Request, Response, NextFunction } from 'express';

export const getSessions = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};
