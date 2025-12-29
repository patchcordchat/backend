import { Request, Response, NextFunction } from 'express';
import { ApiError, BadRequestError, NotFoundError } from '@/errors';
import { StoragePaths } from '@/utils/storage.utils';
import { processBase64Image, generateFileHash } from '@/utils/image.utils';
import { uploadFile } from '@/services/storage.service';
import Role from '@/models/role';
import User from '@/models/user';
import Server from '@/models/server';
import ServerMember from '@/models/server-member';

export const getServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;
    if (!serverId) {
      throw new BadRequestError('Invalid request.');
    }

    const existingServer = await Server.findById(serverId);
    if (!existingServer) {
      throw new NotFoundError('Server not found');
    }

    res.json(existingServer);
  } catch (error) {
    next(error);
  }
};

export const createServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newServer = new Server({
      ...req.body,
      owner_id: req.session?.user_id,
    });

    if (req.body.icon) {
      const image = processBase64Image(req.body.icon);

      if (image) {
        const fileHash = generateFileHash();
        const key = StoragePaths.serverIcon(newServer._id.toString(), fileHash);

        await uploadFile(key, image.buffer, image.contentType);

        newServer.icon = fileHash;
      }
    }

    await newServer.save();

    const everyoneRole = new Role({
      server_id: newServer._id,
      name: '@everyone',
      permissions: 0,
    });

    await everyoneRole.save();

    const ownerMember = new ServerMember({
      server_id: newServer._id,
      user_id: req.session?.user_id,
      roles: [everyoneRole._id],
    });

    await ownerMember.save();

    res.json(newServer);
  } catch (error) {
    next(error);
  }
};

export const modifyServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;
    if (!serverId) {
      throw new BadRequestError('Invalid request.');
    }

    if (req.body.icon) {
      const image = processBase64Image(req.body.icon);

      if (image) {
        const fileHash = generateFileHash();
        const key = StoragePaths.serverIcon(serverId, fileHash);

        await uploadFile(key, image.buffer, image.contentType);

        req.body.icon = fileHash;
      }
    }

    const server = await Server.findByIdAndUpdate(serverId, req.body, {
      new: true,
    });
    if (!server) {
      throw new NotFoundError('Server not found');
    }

    res.json(server);
  } catch (error) {
    next(error);
  }
};

export const deleteServer = async (req: Request, res: Response, next: NextFunction) => {
  const serverId = req.params?.server_id;

  try {
    const result = await Server.findByIdAndDelete(serverId);
    if (!result) {
      throw new NotFoundError('Server not found');
    }

    await ServerMember.deleteMany({ server_id: serverId });
    await Role.deleteMany({ server_id: serverId });

    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const getServerPreview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;

    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }

    const memberCount = await ServerMember.countDocuments({
      server_id: serverId,
    });

    const preview = {
      id: server._id,
      name: server.name,
      icon: server.icon,
      description: server.description,
      approximate_member_count: memberCount,
    };

    res.json(preview);
  } catch (error) {
    next(error);
  }
};

export const getServerMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;

    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found.');
    }

    const members = await ServerMember.find({ server_id: serverId }).populate(
      'user_id',
      'username global_name avatar bot',
    );

    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const searchServerMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;
    const query = req.query?.query as string;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const serverMembers = await ServerMember.find({
      server_id: serverId,
    }).select('user_id');
    const userIds = serverMembers.map((member) => member.user_id);

    const users = await User.find({
      _id: { $in: userIds },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { global_name: { $regex: query, $options: 'i' } },
      ],
    }).select('username global_name avatar bot');

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const joinServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;
    const userId = req.session?.user_id;

    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }

    const isMember = await ServerMember.exists({
      server_id: serverId,
      user_id: userId,
    });
    if (isMember) {
      throw new ApiError('Already a member', 400);
    }

    const newMember = new ServerMember({
      server_id: serverId,
      user_id: userId,
    });

    await newMember.save();

    res.json(newMember);
  } catch (error) {
    next(error);
  }
};

export const addServerMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;
    const userIdToAdd = req.params?.user_id;

    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }

    const userToAdd = await User.findById(userIdToAdd);
    if (!userToAdd) {
      throw new NotFoundError('User to add not found');
    }

    const isMember = await ServerMember.exists({
      server_id: serverId,
      user_id: userIdToAdd,
    });
    if (isMember) {
      return res.json({ message: 'User is already a member' });
    }

    const newMember = new ServerMember({
      server_id: serverId,
      user_id: userIdToAdd,
    });

    await newMember.save();

    res.json(newMember);
  } catch (error) {
    next(error);
  }
};

export const getServerRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;

    const serverExists = await Server.exists({ _id: serverId });
    if (!serverExists) {
      throw new NotFoundError('Server not found.');
    }

    const roles = await Role.find({ server_id: serverId });

    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const getMyServers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.user_id;

    const memberEntries = await ServerMember.find({ user_id: userId }).select('server_id');
    const serverIds = memberEntries.map((entry) => entry.server_id);

    const servers = await Server.find({ _id: { $in: serverIds } });

    res.json(servers);
  } catch (error) {
    next(error);
  }
};
export const leaveFromServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params?.server_id;
    const userId = req.session?.user_id;

    const server = await Server.findById(serverId);
    if (!server) {
      throw new NotFoundError('Server not found');
    }

    if (userId && server.owner_id.toString() === userId.toString()) {
      throw new BadRequestError('Owner cannot leave a server.');
    }

    const result = await ServerMember.deleteOne({
      server_id: serverId,
      user_id: userId,
    });
    if (result.deletedCount === 0) {
      return res.json({ message: 'You are not a member of this server' });
    }

    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};
