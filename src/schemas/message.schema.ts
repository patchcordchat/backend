import { z } from 'zod';

export const createMessageSchema = {
  body: z.object({
    content: z.string().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.int().gte(0).lte(9).optional(),
    flags: z.int().optional(),
  }),
};

export const getMessagesSchema = {
  query: z.object({
    around: z.string().optional(),
    before: z.string().optional(),
    after: z.string().optional(),
    limit: z.int().gte(1).lte(100).default(50),
  }),
};
