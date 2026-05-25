import { z } from 'zod';
import { Types } from 'mongoose';

export const createAttachmentSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
  }),
  body: z.object({
    files: z.array(
      z.object({
        id: z.string().optional(),
        filename: z.string(),
        filesize: z.number().int(),
        is_clip: z.boolean().optional(),
      }),
    ),
  }),
};

export const deleteAttachmentSchema = {
  params: z.object({
    channel_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid channel id',
    }),
    attachment_id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid attachment id',
    }),
  }),
};
