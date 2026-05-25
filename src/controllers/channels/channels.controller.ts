import { Request, Response, NextFunction } from 'express';
import {
  getServerChannelsSchema,
  createServerChannelSchema,
  modifyChannelPositionSchema,
  getChannelSchema,
  modifyChannelSchema,
  deleteChannelSchema,
  getDMChannelSchema,
  triggerTypingSchema,
  createPrivateChannelSchema,
  getCallEligibilitySchema,
} from '@/schemas/channel.schema';
import Server from '@/models/server';
import Channel, { ChannelTypes } from '@/models/channel';
import { getIO } from '@/socket';
import { NotFoundError, ApiError, UnauthorizedError } from '@/errors';

export const getServerChannels = async (
  req: ValidatedRequest<typeof getServerChannelsSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serverId = req.params?.server_id;

    const serverExists = await Server.exists({ _id: serverId });
    if (!serverExists) {
      throw new NotFoundError('Server not found');
    }

    const channels = await Channel.find({ server_id: serverId }).sort({ position: 1 });

    res.json(channels);
  } catch (error) {
    next(error);
  }
};

export const createServerChannel = async (
  req: ValidatedRequest<
    typeof createServerChannelSchema.params,
    unknown,
    typeof createServerChannelSchema.body
  >,
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
  req: ValidatedRequest<
    typeof modifyChannelPositionSchema.params,
    unknown,
    typeof modifyChannelPositionSchema.body
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serverId = req.params?.server_id;
    const channelId = req.body?.id;
    const userId = req.session?.user_id;

    const server = await Server.findById(serverId);
    if (!server) throw new NotFoundError('Server not found');

    if (server.owner_id.toString() !== userId?.toString()) {
      throw new ApiError('Missing permissions', 403);
    }

    const channel = await Channel.findOneAndUpdate(
      { _id: channelId, server_id: serverId },
      { position: req.body.position },
      { new: true },
    );

    if (!channel) throw new NotFoundError('Channel not found');

    res.json(channel);
  } catch (error) {
    next(error);
  }
};

export const getChannel = async (
  req: ValidatedRequest<typeof getChannelSchema.params>,
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
  req: ValidatedRequest<
    typeof modifyChannelSchema.params,
    unknown,
    typeof modifyChannelSchema.body
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const channelId = req.params?.channel_id;

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
  req: ValidatedRequest<typeof deleteChannelSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const channelId = req.params?.channel_id;

    const channel = await Channel.findById(channelId);
    if (!channel) throw new NotFoundError('Channel not found');

    await channel.deleteOne();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getPrivateChannels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.user_id;

    const channels = await Channel.find({
      recipients: { $in: [userId] },
      type: ChannelTypes.DM,
    });

    res.json(channels);
  } catch (error) {
    next(error);
  }
};

export const createPrivateChannel = async (
  req: ValidatedRequest<unknown, unknown, typeof createPrivateChannelSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session?.user_id;

    if (!userId) {
      throw new UnauthorizedError();
    }

    const newChannel = new Channel({
      ...req.body,
      recipients: req.body.recipients.push(userId.toString()),
      type: ChannelTypes.DM,
      owner_id: userId,
    });

    await newChannel.save();

    res.json(newChannel);
  } catch (error) {
    next(error);
  }
};

export const getDMChannel = async (
  req: ValidatedRequest<typeof getDMChannelSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session?.user_id;
    const recipientId = req.params?.user_id;

    const channel = await Channel.findOne({
      recipients: { $all: [userId, recipientId] },
      type: ChannelTypes.DM,
    });

    res.json(channel);
  } catch (error) {
    next(error);
  }
};

export const triggerTyping = async (
  req: ValidatedRequest<typeof triggerTypingSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const channelId = req.params?.channel_id;

    const io = getIO();
    io.to(`channel:${channelId}`).emit('typing:start', channelId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCallEligibility = async (
  req: ValidatedRequest<typeof getCallEligibilitySchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};
