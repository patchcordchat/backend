import { z } from 'zod';

export const modifyMeSchema = {
  body: z.object({
    username: z.string().min(2).max(32).optional(),
    global_name: z.string().min(1).max(32).optional(),
    avatar: z.string().optional(),
    email: z.email().optional(),
    email_token: z.string().optional(),
    pronouns: z.string().max(40).optional(),
    bio: z.string().max(190).optional(),
    flags: z.number().int().gte(0).optional(),
    date_of_birth: z.date().optional(),
    password: z.string().min(8).max(72).optional(),
    new_password: z.string().min(8).max(72).optional(),
  }),
};

export const updateMyAccountSchema = {
  body: z.object({
    global_name: z.string().min(8).max(72),
  }),
};

export const updateMyProfileSchema = {
  body: z.object({
    pronouns: z.string().max(40).optional(),
    bio: z.string().max(190).optional(),
  }),
};

export const disableMyAccountSchema = {
  body: z.object({
    password: z.string().min(8).max(72),
  }),
};

export const deleteMyAccountSchema = {
  body: z.object({
    password: z.string().min(8).max(72),
  }),
};
