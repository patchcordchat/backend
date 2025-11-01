import { Request, Response, NextFunction } from 'express';
import { IUser } from '@/models/user';

export interface CustomRequest extends Request {
  user?: IUser;
  token?: string;
}

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed.' });
  }
};

export default authMiddleware;
