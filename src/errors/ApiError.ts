import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(
    message?: string,
    public status: number = 500,
    public details?: unknown,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  withDetails(details: unknown): this {
    this.details = details;
    return this;
  }
  
  withCode(code: string): this {
    this.code = code;
    return this;
  }
}