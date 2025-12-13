import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(8).max(72),
  }),
};

export const registerSchema = {
  body: z.object({
    username: z.string().min(2).max(32).optional(),
    global_name: z.string().min(1).max(32).optional(),
    email: z.email(),
    password: z.string().min(8).max(72),
    date_of_birth: z.date().optional(),
    consent: z.boolean().optional(),
    promotional_email_opt_in: z.boolean().optional(),
  }),
};
