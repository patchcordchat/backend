import { z } from 'zod';

export const sendFriendRequestSchema = {
  body: z.object({}),
};

export const createRelationshipSchema = {
  body: z.object({}),
};

export const modifyRelationshipSchema = {
  body: z.object({}),
};

export const removeRelationshipSchema = {
  body: z.object({}),
};
