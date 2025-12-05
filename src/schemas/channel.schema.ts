import { z } from 'zod';

export const createChannelSchema = {
  body: z.object({
    name: z.string().min(1).max(100),
    type: z.number().gte(0).lte(3),
    position: z.number().gte(0).lte(1000).optional(),
    user_limit: z.number().gte(0).lte(99).optional(),
  }),
};

export const updateChannelSchema = {
  body: z.object({
    name: z.string().min(1).max(100),
    position: z.number().gte(0).lte(1000).optional(),
    user_limit: z.number().gte(0).lte(99).optional(),
    flags: z.number().gte(0).optional(),
  }),
};

export const createPrivateChannelsSchema = {
  body: z.object({
    recipients: z.array(z.string()).min(1).max(100),
    nicks: z
      .array(z.object({ id: z.string(), nick: z.string() }))
      .min(1)
      .max(100),
  }),
};
