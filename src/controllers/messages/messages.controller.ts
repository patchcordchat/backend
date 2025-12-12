import { BadRequestError, NotFoundError } from '@/errors';
import Channel from '@/models/channel';
import Message, { MessageTypes } from '@/models/message';
import { Request, Response, NextFunction } from 'express';

const buildPaginationQuery = (
  baseQuery: any,
  before?: string,
  after?: string,
) => {
  const query = { ...baseQuery };

  if (before) {
    query._id = { $lt: before };
  } else if (after) {
    query._id = { $gt: after };
  }

  return query;
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const channelId = req.params.channel_id;
    const userId = req.session?.user_id;
    const { content, tts, type, flags } = req.body;

    if (
      (!content || content.trim().length === 0) &&
      (!req.body.attachments || req.body.attachments.length === 0)
    ) {
      throw new BadRequestError('Cannot send an empty message.');
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      throw new NotFoundError('Channel not found');
    }

    const newMessage = new Message({
      channel_id: channelId,
      author: userId,
      content: content,
      tts: tts || false,
      type: type || MessageTypes.DEFAULT,
      flags: flags || 0,
      attachments: req.body.attachments || [],
    });

    await newMessage.save();

    await Channel.findByIdAndUpdate(channelId, {
      last_message_id: newMessage._id,
    });

    await newMessage.populate('author', 'username global_name avatar bot');

    res.json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const channelId = req.params.channel_id;
    const limit = Number(req.query.limit) || 50;
    const { before, after, around } = req.query as {
      before?: string;
      after?: string;
      around?: string;
    };

    const channel = await Channel.findById(channelId);
    if (!channel) {
      throw new NotFoundError('Channel not found');
    }

    const query = buildPaginationQuery(
      { channel_id: channelId },
      before,
      after,
    );

    const sortOrder = after ? 1 : -1;

    const messages = await Message.find(query)
      .sort({ _id: sortOrder })
      .limit(limit)
      .populate('author', 'username global_name avatar bot')

    if (after) {
      messages.reverse();
    }

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { channel_id, message_id } = req.params;

    const message = await Message.findOne({
      _id: message_id,
      channel_id: channel_id,
    })
      .populate('author', 'username global_name avatar bot')
      .populate('attachments');

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const modifyMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { channel_id, message_id } = req.params;
    const userId = req.session?.user_id;
    const { content, flags } = req.body;

    const message = await Message.findOne({
      _id: message_id,
      channel_id: channel_id,
    });
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (message.author.toString() !== userId?.toString()) {
      throw new BadRequestError('You can only edit your own messages');
    }

    if (content !== undefined) {
      if (content.trim().length === 0) {
        throw new BadRequestError('Message content cannot be empty.');
      }
      message.content = content;
    }

    if (flags !== undefined) {
      message.flags = flags;
    }

    message.edited_timestamp = Date.now();
    await message.save();

    await message.populate('author', 'username global_name avatar bot');

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getDMMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;
    const limit = Number(req.query.limit) || 50;
    const { before, after, around } = req.query as {
      before?: string;
      after?: string;
      around?: string;
    };

    // const channel = await findDMChannel(currentUserId!, targetUserId);
    // if (!channel) {
    //   return res.json([]);
    // }
    // const query = buildPaginationQuery({ channel_id: channel._id }, before, after);
    // const sortOrder = after ? 1 : -1;

    // const messages = await Message.find(query)
    //   .sort({ _id: sortOrder })
    //   .limit(limit)
    //   .populate('author', 'username global_name avatar bot')
    //   .populate('attachments');

    // if (after) {
    //   messages.reverse();
    // }

    // res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const createDMMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;
    const { content, tts, type, flags, attachments } = req.body;

    // const targetUser = await User.findById(targetUserId);
    // if (!targetUser) {
    //   throw new NotFoundError('User not found');
    // }

    // let channel = await findDMChannel(currentUserId!, targetUserId);

    // if (!channel) {
    //   throw new NotFoundError('DM channel not found');
    // }

    // const newMessage = new Message({
    //   channel_id: channel._id,
    //   author: currentUserId,
    //   content: content,
    //   tts: tts || false,
    //   type: type || MessageTypes.DEFAULT,
    //   flags: flags || 0,
    //   attachments: attachments || [],
    // });

    // await newMessage.save();

    // await Channel.findByIdAndUpdate(channel._id, {
    //   last_message_id: newMessage._id,
    //   updated_at: Date.now(),
    // });

    // await newMessage.populate('author', 'username global_name avatar bot');

    // res.json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const modifyDMMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, message_id } = req.params;
    const currentUserId = req.session?.user_id;
    const { content, flags } = req.body;

    const message = await Message.findById(message_id);

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // if (message.author.toString() !== currentUserId?.toString()) {
    //   throw new ApiError('You can only edit your own messages', 403);
    // }

    // if (content !== undefined) {
    //    if (content.trim().length === 0) {
    //      throw new BadRequestError('Message content cannot be empty.');
    //    }
    //    message.content = content;
    // }
    
    // if (flags !== undefined) {
    //   message.flags = flags;
    // }

    // message.edited_timestamp = Date.now();
    // await message.save();

    // await message.populate('author', 'username global_name avatar bot');

    // res.json(message);
  } catch (error) {
    next(error);
  }
};
