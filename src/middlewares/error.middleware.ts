import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/errors';

const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status ?? 500;
  const message =
    status >= 500 ? 'Internal Server Error' : (err.message ?? 'Error');

  const response: any = { error: { message } };

  if (err instanceof ApiError && status < 500 && err.details !== undefined) {
    response.error.details = err.details;
  }

  if (err instanceof ApiError && err.code) {
    response.error.code = err.code;
  }

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json(response);
};

export default errorMiddleware;
