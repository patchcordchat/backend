import { z } from 'zod';
import { Types } from 'mongoose';

export const getChannelSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
};

export const modifyChannelSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(100),
    position: z.number().int().gte(0).optional(),
    icon: z.string().optional(),
    user_limit: z.number().int().gte(0).lte(99).optional(),
    flags: z.number().int().gte(0).optional(),
  }),
};

export const deleteChannelSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
};

export const triggerTypingSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
};

export const getCallEligibilitySchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
};

export const createPrivateChannelSchema = {
  body: z.object({
    recipients: z.array(z.string()).min(1).max(100),
    nicks: z
      .array(z.object({ id: z.string(), nick: z.string().trim() }))
      .min(1)
      .max(100),
  }),
};

export const getDMChannelSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
};

export const getServerChannelsSchema = {
  params: z.object({
    server_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid server id',
    }),
  }),
};

export const createServerChannelSchema = {
  params: z.object({
    server_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid server id',
    }),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(100),
    type: z.number().int().gte(0).lte(3),
    position: z.number().int().gte(0).lte(1000).optional(),
    user_limit: z.number().int().gte(0).lte(99).optional(),
  }),
};

export const modifyChannelPositionSchema = {
  params: z.object({
    server_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid server id',
    }),
  }),
  body: z.object({
    id: z.string(),
    position: z.number().int().optional(),
  }),
};
