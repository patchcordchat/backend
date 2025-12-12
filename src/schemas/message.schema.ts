import { z } from 'zod';

export const getMessageSchema = {
  params: z.object({
    channel_id: z.string(),
    message_id: z.string(),
  }),
  body: z.object({
    content: z.string().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.int().gte(0).lte(9).optional(),
    flags: z.int().optional(),
  }),
};

export const createMessageSchema = {
  params: z.object({
    channel_id: z.string(),
  }),
  body: z.object({
    content: z.string().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.int().gte(0).lte(9).optional(),
    flags: z.int().optional(),
  }),
};

export const getMessagesSchema = {
  params: z.object({
    channel_id: z.string(),
  }),
  query: z.object({
    around: z.string().optional(),
    before: z.string().optional(),
    after: z.string().optional(),
    limit: z.coerce.number().int().gte(1).lte(100).default(50),
  }),
};

export const modifyMessageSchema = {
  params: z.object({
    channel_id: z.string(),
    message_id: z.string(),
  }),
  body: z.object({
    content: z.string().max(2000).optional(),
    flags: z.int().optional(),
  }),
}

export const getDMMessagesSchema = {
  params: z.object({
    user_id: z.string(),
  }),
  query: z.object({
    around: z.string().optional(),
    before: z.string().optional(),
    after: z.string().optional(),
    limit: z.coerce.number().int().gte(1).lte(100).default(50),
  }),
};

export const createDMMessageSchema = {
  params: z.object({
    user_id: z.string(),
  }),
  body: z.object({
    content: z.string().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.int().gte(0).lte(9).optional(),
    flags: z.int().optional(),
  }),
}

export const modifyDMMessageSchema = {
  params: z.object({
    user_id: z.string(),
    message_id: z.string(),
  }),
  body: z.object({
    content: z.string().max(2000).optional(),
    flags: z.int().optional(),
  }),
}