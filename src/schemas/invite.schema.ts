import { z } from 'zod';

export const getInviteSchema = {
  query: z.object({
    with_counts: z.boolean().default(false).optional(),
    with_permissions: z.boolean().default(false).optional(),
  }),
};

export const createInviteSchema = {
  body: z.object({
    flags: z.int().optional(),
    max_age: z.int().gte(0).lte(5184000).default(86400).optional(),
    max_uses: z.int().gte(0).lte(100).default(0).optional(),
  }),
};