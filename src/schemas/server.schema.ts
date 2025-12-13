import { z } from 'zod';

export const getServerSchema = {
  params: z.object({
    server_id: z.string(),
  }),
};

export const getMyServersSchema = {
  query: z.object({
    before: z.string().optional(),
    after: z.string().optional(),
    limit: z.coerce.number().int().gte(1).lte(2000).default(2000).optional(),
    with_counts: z.coerce.boolean().default(false).optional(),
  }),
};

export const leaveFromServerSchema = {
  params: z.object({
    server_id: z.string(),
  }),
}

export const createServerSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(300).optional(),
    icon: z.string().optional(),
    afk_timeout: z.number().int().gte(60).lte(3600).optional(),
  }),
};

export const modifyServerSchema = {
  params: z.object({
    server_id: z.string(),
  }),
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(300).optional(),
    icon: z.string().optional(),
    owner_id: z.string().optional(),
    afk_channel_id: z.string().optional(),
  }),
};

export const deleteServerSchema = {
  params: z.object({
    server_id: z.string(),
  }),
};

export const getServerPreviewSchema = {
  params: z.object({
    server_id: z.string(),
  }),
};

export const getServerMembersSchema = {
  params: z.object({
    server_id: z.string(),
  }),
  query: z.object({
    limit: z.coerce.number().int().gte(1).lte(1000).default(1).optional(),
    after: z.string().optional(),
  }),
};

export const searchServerMembersSchema = {
  params: z.object({
    server_id: z.string(),
  }),
  body: z.object({
    limit: z.number().int().gte(1).lte(1000).default(25).optional(),
    after: z.string().optional(),
    sort: z.number().int(),
  }),
};

export const joinServerSchema = {
  params: z.object({
    server_id: z.string(),
  }),
};

export const addServerMemberSchema = {
  params: z.object({
    server_id: z.string(),
    user_id: z.string(),
  }),
  body: z.object({
    nick: z.string().optional(),
    roles: z.array(z.string()).optional(),
    flags: z.number().int().gte(0).optional(),
  }),
};

export const getServerRolesSchema = {
  params: z.object({
    server_id: z.string(),
  }),
};
