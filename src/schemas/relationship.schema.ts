import { z } from 'zod';
import { Types } from 'mongoose';

export const sendFriendRequestSchema = {
  body: z.object({
    username: z.string().min(2).max(32),
  }),
};

export const createRelationshipSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
  body: z.object({
    type: z.number().int().gte(0).lte(5).optional(),
    from_friend_suggestion: z.boolean().optional(),
    confirm_stranger_request: z.boolean().optional(),
  }),
};

export const ignoreUserSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
};

export const unignoreUserSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
};

export const modifyRelationshipSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
  body: z.object({
    nickname: z.string().min(1).max(32).optional(),
  }),
};

export const removeRelationshipSchema = {
  params: z.object({
    user_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user id',
    }),
  }),
};

export const bulkRemoveRelationshipSchema = {
  query: z.object({
    relationship_type: z.number().int().gte(0).lte(5).optional(),
  }),
  body: z.object({
    filters: z.array(z.string()).optional(),
  }),
};

export const bulkCreateRelationshipsSchema = {
  body: z.object({
    user_ids: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: 'Invalid user id',
        }),
      )
      .min(1),
  }),
};
