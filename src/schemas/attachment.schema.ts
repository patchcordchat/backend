import { z } from 'zod';

export const createAttachmentSchema = {
  params: z.object({
    channel_id: z.string(),
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
    channel_id: z.string(),
    attachment_id: z.string(),
  }),
};
