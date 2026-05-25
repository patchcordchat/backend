import { z } from 'zod';

export const getInviteSchema = {
  query: z.object({
    with_counts: z.coerce.boolean().default(false).optional(),
    with_permissions: z.coerce.boolean().default(false).optional(),
  }),
};

export const createInviteSchema = {
  body: z.object({
    flags: z.coerce.number().int().optional(),
    max_age: z.coerce
      .number()
      .int()
      .gte(0)
      .lte(5184000)
      .default(86400)
      .optional(),
    max_uses: z.coerce.number().int().gte(0).lte(100).default(0).optional(),
  }),
};
