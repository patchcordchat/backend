import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '@/errors';
import User from '@/models/user';
import { StoragePaths } from '@/utils/storage.utils';
import { processBase64Image, generateFileHash } from '@/utils/image.utils';
import { uploadFile } from '@/services/storage.service';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.user_id;
    if (!userId) {
      throw new BadRequestError('Invalid request.');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.user_id;
    if (!userId) {
      throw new BadRequestError('Invalid request.');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    if (req.body.avatar) {
      const image = processBase64Image(req.body.avatar);

      if (image) {
        const fileHash = generateFileHash();
        const key = StoragePaths.userAvatar(userId.toString(), fileHash);

        await uploadFile(key, image.buffer, image.contentType);

        user.avatar = fileHash;
      }
    }

    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMyAccount = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const disableMyAccount = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const deleteMyAccount = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};
