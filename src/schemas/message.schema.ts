import { z } from 'zod';

export const createMessageSchema = {
  body: z.object({
    content: z.string().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.number().gte(0).lte(9).optional(),
    flags: z.number().optional(),
  }),
};

export const getMessagesSchema = {
  query: z.object({
    around: z.string().optional(),
    before: z.string().optional(),
    after: z.string().optional(),
    limit: z.number().gte(1).lte(100).default(50),
  }),
};
