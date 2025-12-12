import { z } from 'zod';

export const getChannelSchema = {
  params: z.object({
    channel_id: z.string(),
  }),
};

export const modifyChannelSchema = {
  params: z.object({
    channel_id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).max(100),
    position: z.int().gte(0).optional(),
    icon: z.string().optional(),
    user_limit: z.int().gte(0).lte(99).optional(),
    flags: z.int().gte(0).optional(),
  }),
};

export const deleteChannelSchema = {
  params: z.object({
    channel_id: z.string(),
  }),
};

export const triggerTypingSchema = {
  params: z.object({
    channel_id: z.string(),
  }),
};

export const getCallEligibilitySchema = {
  params: z.object({
    channel_id: z.string(),
  }),
};

export const createPrivateChannelSchema = {
  body: z.object({
    recipients: z.array(z.string()).min(1).max(100),
    nicks: z
      .array(z.object({ id: z.string(), nick: z.string() }))
      .min(1)
      .max(100),
  }),
};

export const getDMChannelSchema = {
  params: z.object({
    user_id: z.string(),
  }),
};

export const getServerChannelsSchema = {
  params: z.object({
    server_id: z.string(),
  }),
};

export const createServerChannelSchema = {
  body: z.object({
    name: z.string().min(1).max(100),
    type: z.int().gte(0).lte(3),
    position: z.int().gte(0).lte(1000).optional(),
    user_limit: z.int().gte(0).lte(99).optional(),
  }),
};

export const modifyChannelPositionSchema = {
  body: z.object({
    id: z.string(),
    position: z.int().optional(),
  }),
};
