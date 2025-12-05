import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/errors';
import Server, { IServer } from '@/models/server';

export const getServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params?.id;
    if (!id) {
      throw new BadRequestError('Invalid request.');
    }
    const existingServer = await Server.find({ _id: id });
    if (!existingServer) {
      throw new NotFoundError('Server not found');
    }
    res.json(existingServer);
  } catch (error) {
    next(error);
  }
};

export const createServer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication failed. User not found.');
  }

  try {
    const newServer = new Server({
      ...req.body,
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

  const existingServer = await Server.findById(id);
  if (!existingServer) {
    throw new NotFoundError('Server not found');
  }

  try {
    existingServer.name = req.body.name ?? existingServer.name;
    existingServer.description =
      req.body.description ?? existingServer.description;
    existingServer.afk_timeout =
      req.body.afk_timeout ?? existingServer.afk_timeout;

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

  try {
    await Server.deleteOne({ _id: id });

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
