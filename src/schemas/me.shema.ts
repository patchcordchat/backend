import { z } from 'zod';

export const updateMeSchema = {
  body: z.object({
    username: z.string().min(2).max(32).optional(),
    global_name: z.string().min(1).max(32).optional(),
    email: z.email().optional(),
    pronouns: z.string().max(40).optional(),
    bio: z.string().max(190).optional(),
    flags: z.int().gte(0).optional(),
    date_of_birth: z.date().optional(),
    password: z.string().min(8).max(72).optional(),
    new_password: z.string().min(8).max(72).optional(),
  }),
};

export const updateMyAccountSchema = {
  body: z.object({
    global_name: z.string().min(1).max(32).optional(),
  }),
};

export const updateMyProfileSchema = {
  body: z.object({
    pronouns: z.string().max(40).optional(),
    bio: z.string().max(190).optional(),
  }),
};