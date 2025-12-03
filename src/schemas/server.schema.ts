import { z } from 'zod';

export const createServerSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(300).optional(),
    afk_timeout: z.number().gte(60).lte(3600).optional(),
  }),
};

export const updateServerSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(300).optional(),
    owner_id: z.string().optional(),
    afk_channel_id: z.string().optional(),
  }),
};

export const getServerMembersSchema = {
  body: z.object({
    query: z.string(),
    limit: z.int().gte(1).lte(1000).default(1).optional(),
  }),
};

export const searchServerMembersSchema = {
  body: z.object({
    limit: z.int().gte(1).lte(1000).default(25).optional(),
    after: z.string().optional(),
    sort: z.int(),
  }),
};
