import { Request, Response, NextFunction } from 'express';
import Server from '@/models/server';
import Channel from '@/models/channel';
import { getIO } from '@/socket';
import { NotFoundError, ApiError } from '@/errors';

export const getServerChannels = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serverId = req.params?.server_id;

    const serverExists = await Server.exists({ _id: serverId });
    if (!serverExists) {
      throw new NotFoundError('Server not found');
    }

    const channels = await Channel.find({ server_id: serverId })
      .sort({ position: 1 })
      .lean();

    res.json(channels);
  } catch (error) {
    next(error);
  }
};

export const createServerChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serverId = req.params?.server_id;
    const userId = req.session?.user_id;

    const server = await Server.findById(serverId);
    if (!server) throw new NotFoundError('Server not found');

    if (userId && server.owner_id.toString() !== userId.toString()) {
      throw new ApiError('You do not have permission to create channels', 403);
    }

    const newChannel = new Channel({
      ...req.body,
      server_id: serverId,
      owner_id: userId,
    });

    await newChannel.save();

    res.json(newChannel);
  } catch (error) {
    next(error);
  }
};

export const modifyChannelPosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serverId = req.params?.server_id;
    const channelId = req.params?.channel_id;
    const userId = req.session?.user_id;

    const server = await Server.findById(serverId);
    if (!server) throw new NotFoundError('Server not found');

    if (server.owner_id.toString() !== userId?.toString()) {
      throw new ApiError('Missing permissions', 403);
    }

    const channel = await Channel.findOneAndUpdate(
      { _id: channelId, server_id: serverId },
      ...req.body,
      { new: true },
    );

    if (!channel) throw new NotFoundError('Channel not found');

    res.json(channel);
  } catch (error) {
    next(error);
  }
};

export const getChannel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { channel_id } = req.params;
    const channel = await Channel.findById(channel_id);

    if (!channel) throw new NotFoundError('Channel not found');

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
    const channelId = req.params?.channel_id;
    const userId = req.session?.user_id;

    const channel = await Channel.findById(channelId);
    if (!channel) throw new NotFoundError('Channel not found');

    Object.assign(channel, req.body);
    await channel.save();

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
    const channelId = req.params?.channel_id;

    const channel = await Channel.findById(channelId);
    if (!channel) throw new NotFoundError('Channel not found');

    await channel.deleteOne();

    res.json({ message: 'Success' });
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

export const getDMChannel = async (
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

export const triggerTyping = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const channelId = req.params?.channel_id;
    
    const io = getIO();
    io.to(`channel:${channelId}`).emit('typing:start', channelId);
    
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const getCallEligibility = async (
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
