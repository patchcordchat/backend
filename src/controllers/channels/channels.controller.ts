import { Request, Response, NextFunction } from 'express';
import Channel from '@/models/channel';

export const getChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    next(error);
  }
};

export const modifyChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const channel = await Channel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!channel) {
      return res.status(404).json({
        error: 'Channel not found',
      });
    }

    res.json(channel);
  } catch (error) {
    next(error);
  }
};

export const deleteChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findByIdAndDelete(id);

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json(channel);
  } catch (error) {
    next(error);
  }
};

export const getPrivateChannels = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const createPrivateChannel = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};
