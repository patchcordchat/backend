export class ApiError extends Error {
  constructor(
    message?: string,
    public status = 500,
    public details?: unknown,
    public code?: string,
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

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}
