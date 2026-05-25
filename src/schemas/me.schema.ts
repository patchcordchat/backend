import { z } from 'zod';

export const modifyMeSchema = {
  body: z.object({
    username: z.string().trim().min(2).max(32).optional(),
    global_name: z.string().trim().min(1).max(32).optional(),
    avatar: z.string().optional(),
    email: z.email().optional(),
    email_token: z.string().optional(),
    pronouns: z.string().max(40).optional(),
    bio: z.string().max(190).optional(),
    flags: z.number().int().gte(0).optional(),
    date_of_birth: z.coerce
      .date()
      .min(new Date('1873-01-01'))
      .max(new Date('2022-01-01'))
      .optional(),
    password: z.string().min(8).max(72).optional(),
    new_password: z.string().min(8).max(72).optional(),
  }),
};

export const updateMyAccountSchema = {
  body: z.object({
    global_name: z.string().trim().min(8).max(72),
  }),
};

export const updateMyProfileSchema = {
  body: z.object({
    pronouns: z.string().trim().max(40).optional(),
    bio: z.string().trim().max(190).optional(),
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
