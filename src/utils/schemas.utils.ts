import { z } from 'zod';
import { type ParsedQs } from 'qs';

export type InferRequestSchema<S> = {
  params: S extends { params: z.ZodTypeAny }
    ? z.infer<S['params']>
    : Record<string, string>;
  body: S extends { body: z.ZodTypeAny } ? z.infer<S['body']> : any;
  query: S extends { query: z.ZodTypeAny } ? z.infer<S['query']> : ParsedQs;
};
