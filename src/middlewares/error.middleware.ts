import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(
    message?: string, 
    public status?: number
  ) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    }
  });
};

export default errorMiddleware;
