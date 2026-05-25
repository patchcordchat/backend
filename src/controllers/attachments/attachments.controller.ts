import { Request, Response, NextFunction } from 'express';

export const createAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};
