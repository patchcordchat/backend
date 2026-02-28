import { z } from 'zod';
import { Types } from 'mongoose';

export const getMessageSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
    message_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid message id',
    }),
  }),
  body: z.object({
    content: z.string().trim().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.number().int().gte(0).lte(9).optional(),
    flags: z.number().int().optional(),
  }),
};

export const createMessageSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
  body: z.object({
    content: z.string().trim().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.number().int().gte(0).lte(9).optional(),
    flags: z.number().int().optional(),
    attachments: z.array(
      z.object({
        id: z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: 'Invalid attachment id',
        }),
        filename: z.string(),
      }),
    ),
  }),
};

export const getMessagesSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
  query: z.object({
    around: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid message id',
      })
      .optional(),
    before: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid message id',
      })
      .optional(),
    after: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid message id',
      })
      .optional(),
    limit: z.number().int().gte(1).lte(100).default(50),
  }),
};

export const modifyMessageSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
    message_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid message id',
    }),
  }),
  body: z.object({
    content: z.string().trim().max(2000).optional(),
    flags: z.number().int().optional(),
    attachments: z.array(
      z.object({
        id: z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: 'Invalid attachment id',
        }),
        filename: z.string(),
      }),
    ),
  }),
};

export const getDMMessagesSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
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
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
  body: z.object({
    content: z.string().trim().max(2000).optional(),
    tts: z.boolean().optional(),
    type: z.number().int().gte(0).lte(9).optional(),
    flags: z.number().int().optional(),
  }),
};

export const modifyDMMessageSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
    message_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid message id',
    }),
  }),
  body: z.object({
    content: z.string().trim().max(2000).optional(),
    flags: z.number().int().optional(),
  }),
};
