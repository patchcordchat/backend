import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(72),
});

export const registerSchema = z.object({
    username: z.string().optional(),
    global_name: z.string().optional(),
    email: z.email(),
    password: z.string().min(8).max(72),
    date_of_birth: z.date().optional(),
    consent: z.boolean().optional(),
    promotional_email_opt_in: z.boolean().optional(),
});