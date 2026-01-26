import { Request, Response, NextFunction } from 'express';

export const createAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};
