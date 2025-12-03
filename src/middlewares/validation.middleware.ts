import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@/errors';
import express from 'express';
import { z } from 'zod';

const descriptor = Object.getOwnPropertyDescriptor(express.request, 'query');
if (descriptor) {
	Object.defineProperty(express.request, 'query', {
		get(this: Request) {
			if (this.hasOwnProperty('_query')) return this._query;
			return descriptor?.get?.call(this);
		},
		set(this: Request, query: unknown) {
			this._query = query;
		},
		configurable: true,
		enumerable: true
	});
}

type RequestPart = 'body' | 'query' | 'params';

const validateRequest =
  (schemas: Partial<Record<RequestPart, z.ZodSchema>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Promise.all([
        schemas.body ? schemas.body.parseAsync(req.body) : Promise.resolve(req.body),
        schemas.query ? schemas.query.parseAsync(req.query) : Promise.resolve(req.query),
        schemas.params ? schemas.params.parseAsync(req.params) : Promise.resolve(req.params),
      ]);

      const [validatedBody, validatedQuery, validatedParams] = result as [
        typeof req.body,
        typeof req.query,
        typeof req.params
      ];

      req.body = validatedBody;
      req.query = validatedQuery;
      req.params = validatedParams;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));

        return next(new BadRequestError().withDetails(details));
      }

      return next(error);
    }
  };

export default validateRequest;
