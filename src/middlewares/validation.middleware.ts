import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@/errors';
import { z } from 'zod';

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

      res.locals.body = validatedBody;
      res.locals.query = validatedQuery;
      res.locals.params = validatedParams;

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
