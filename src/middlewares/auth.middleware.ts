import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import config from '@/config'
import User, { IUser } from '@/models/user';

export interface CustomRequest extends Request {
  user: IUser;
  token: string;
}

interface DecodedToken {
  _id: string;
}

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication failed: Token missing.');
    }

    const decoded = verify(
      token,
      config.app.key,
    ) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error('Authentication failed. User not found.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed.' });
  }
};

export default authMiddleware;
