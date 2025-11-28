import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@/middlewares/auth.middleware';
import { ApiError } from '@/middlewares/error.middleware';
import Server, { IServer } from '@/models/server';

export const getServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params?.id;
    if (!id) {
      throw new ApiError('Invalid request.', 400);
    }
    const existingServer = await Server.find({ _id: id });
    if (!existingServer) {
      throw new ApiError('Server not found', 404);
    }
    res.json(existingServer);
  } catch (error) {
    next(error);
  }
};

export const createServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new ApiError('Authentication failed. User not found.', 403);
  }

  const serverData: Partial<IServer> = {
    name: req.body.name,
    description: req.body.description,
    afk_timeout: req.body.afk_timeout,
  };

  if (!serverData.name) {
    throw new ApiError('Please provide all the required fields.', 400);
  }

  try {
    const newServer = new Server({
      name: serverData.name,
      description: serverData.description,
      afk_timeout: serverData.afk_timeout,
      owner_id: req.user.id,
    });

    await newServer.save();

    res.json(newServer);
  } catch (error) {
    next(error);
  }
};

export const modifyServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params?.id;
  if (!id) {
    throw new ApiError('Invalid request.', 400);
  }
  const existingServer = await Server.findById(id);
  if (!existingServer) {
    throw new ApiError('Server not found', 404);
  }

  const serverData: Partial<IServer> = {
    name: req.body.name,
    description: req.body.description,
    afk_timeout: req.body.afk_timeout,
  };

  try {
    existingServer.name = serverData.name ?? existingServer.name;
    existingServer.description =
      serverData.description ?? existingServer.description;
    existingServer.afk_timeout =
      serverData.afk_timeout ?? existingServer.afk_timeout;

    await existingServer.save();

    res.json(existingServer);
  } catch (error) {
    next(error);
  }
};

export const deleteServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params?.id;
  if (!id) {
    throw new ApiError('Invalid request.', 400);
  }

  try {
    await Server.deleteOne({_id: id});
    
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const getServerPreview = (
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

export const getServerMembers = (
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

export const searchServerMembers = (
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

export const joinServer = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

export const addServerMember = (
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

export const getServerRoles = (
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

export const getMyServers = (
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

export const leaveFromServer = (
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
