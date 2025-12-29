import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(8).max(72),
  }),
};

export const registerSchema = {
  body: z.object({
    username: z.string().trim().min(2).max(32).optional(),
    global_name: z.string().trim().min(1).max(32).optional(),
    email: z.email(),
    password: z.string().min(8).max(72),
    date_of_birth: z.coerce
      .date()
      .min(new Date('1873-01-01'))
      .max(new Date('2022-01-01'))
      .optional(),
    consent: z.boolean().optional(),
    promotional_email_opt_in: z.boolean().optional(),
  }),
};
