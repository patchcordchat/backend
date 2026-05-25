import { z, AnyZodObject } from 'zod';
import { Request } from 'express';
import type { ISession } from '@/models/session';

declare global {
  namespace Express {
    interface Request {
      _query?: unknown;
      session?: ISession;
    }
  }
  type ValidatedRequest<
    TParams extends AnyZodObject = AnyZodObject,
    TQuery extends AnyZodObject = AnyZodObject,
    TBody extends AnyZodObject = AnyZodObject,
  > = Request<z.infer<TParams>, unknown, z.infer<TBody>, z.infer<TQuery>>;
}
