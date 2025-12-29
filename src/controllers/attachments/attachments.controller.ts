import { Request, Response, NextFunction } from 'express';

export const createAttachments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channelId = req.params?.channel_id;

    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channelId = req.params?.channel_id;

    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};
