import { Response, Request, NextFunction } from 'express';
import Relationship, { RELATIONSHIP_TYPES } from '@/models/relationship';
import User from '@/models/user';
import {
  sendFriendRequestSchema,
  createRelationshipSchema,
  modifyRelationshipSchema,
  ignoreUserSchema,
  bulkRemoveRelationshipSchema,
  bulkCreateRelationshipsSchema,
} from '@/schemas/relationship.schema';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/errors';

const POPULATE_USER_FIELDS = 'username global_name avatar public_flags bot';

export const getRelationships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.user_id;

    if (!userId) {
      throw new UnauthorizedError();
    }

    const relationships = await Relationship.find({ userId })
      .populate('target_id', POPULATE_USER_FIELDS)
      .lean();

    res.json(relationships);
  } catch (error) {
    next(error);
  }
};

export const sendFriendRequest = async (
  req: ValidatedRequest<unknown, unknown, typeof sendFriendRequestSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUsername = req.body.username;

    if (!currentUserId) throw new UnauthorizedError();

    const targetUser = await User.findOne({ username: targetUsername });

    if (!targetUser) throw new NotFoundError('Target user not found');

    if (currentUserId === targetUser.id) {
      throw new BadRequestError('You cannot create a relationship with yourself.');
    }

    const outgoingRequest = new Relationship({
      userId: currentUserId,
      targetId: targetUser.id,
      type: RELATIONSHIP_TYPES.OUTGOING_REQUEST,
    });

    const incomingRequest = new Relationship({
      userId: targetUser.id,
      targetId: currentUserId,
      type: RELATIONSHIP_TYPES.INCOMING_REQUEST,
    });

    await Promise.all([outgoingRequest.save(), incomingRequest.save()]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createRelationship = async (
  req: ValidatedRequest<
    typeof createRelationshipSchema.params,
    unknown,
    typeof createRelationshipSchema.body
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;
    const { type } = req.body;

    if (!currentUserId) throw new UnauthorizedError();
    if (currentUserId.toString() === targetUserId)
      throw new BadRequestError('Cannot relate to yourself');

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) throw new NotFoundError('User not found');

    if (type === RELATIONSHIP_TYPES.FRIEND) {
      const incoming = await Relationship.findOne({
        user_id: currentUserId,
        target_id: targetUserId,
        type: RELATIONSHIP_TYPES.INCOMING_REQUEST,
      });

      if (!incoming) {
        throw new BadRequestError('No incoming friend request found');
      }

      await Relationship.updateOne(
        { user_id: currentUserId, target_id: targetUserId },
        { type: RELATIONSHIP_TYPES.FRIEND },
      );
      await Relationship.updateOne(
        { user_id: targetUserId, target_id: currentUserId },
        { type: RELATIONSHIP_TYPES.FRIEND },
      );
    } else if (type === RELATIONSHIP_TYPES.BLOCKED) {
      await Relationship.findOneAndUpdate(
        { user_id: currentUserId, target_id: targetUserId },
        { type: RELATIONSHIP_TYPES.BLOCKED },
        { upsert: true },
      );

      await Relationship.deleteOne({
        user_id: targetUserId,
        target_id: currentUserId,
        type: { $ne: RELATIONSHIP_TYPES.BLOCKED },
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const ignoreUser = async (
  req: ValidatedRequest<typeof ignoreUserSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;

    if (!currentUserId) throw new UnauthorizedError();

    const relationship = await Relationship.findOne({
      user_id: currentUserId,
      target_id: targetUserId,
    });

    if (!relationship) throw new NotFoundError('Relationship not found');

    relationship.user_ignored = true;

    await relationship.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const unignoreUser = async (
  req: ValidatedRequest<typeof ignoreUserSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;

    if (!currentUserId) throw new UnauthorizedError();

    const relationship = await Relationship.findOne({
      user_id: currentUserId,
      target_id: targetUserId,
    });

    if (!relationship) throw new NotFoundError('Relationship not found');

    relationship.user_ignored = false;

    await relationship.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const modifyRelationship = async (
  req: ValidatedRequest<
    typeof modifyRelationshipSchema.params,
    unknown,
    typeof modifyRelationshipSchema.body
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;
    const { nickname } = req.body;

    const relationship = await Relationship.findOne({
      user_id: currentUserId,
      target_id: targetUserId,
    });

    if (!relationship) throw new NotFoundError('Relationship not found');

    if (relationship.type !== RELATIONSHIP_TYPES.FRIEND) {
      throw new BadRequestError('You can only set a nickname for friends.');
    }

    if (nickname) {
      relationship.nickname = nickname;
    }

    await relationship.save();
    await relationship.populate('target_id', POPULATE_USER_FIELDS);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const removeRelationship = async (
  req: ValidatedRequest<typeof modifyRelationshipSchema.params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.session?.user_id;
    const targetUserId = req.params.user_id;

    const relationship = await Relationship.findOne({
      user_id: currentUserId,
      target_id: targetUserId,
    });

    if (!relationship) {
      throw new NotFoundError('Relationship not found');
    }

    if (
      [
        RELATIONSHIP_TYPES.FRIEND,
        RELATIONSHIP_TYPES.INCOMING_REQUEST,
        RELATIONSHIP_TYPES.OUTGOING_REQUEST,
      ].includes(relationship.type)
    ) {
      await Relationship.deleteMany({
        $or: [
          { user_id: currentUserId, target_id: targetUserId },
          { user_id: targetUserId, target_id: currentUserId },
        ],
      });
    } else {
      await relationship.deleteOne();
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const bulkRemoveRelationships = async (
  req: ValidatedRequest<
    unknown,
    typeof bulkRemoveRelationshipSchema.query,
    typeof bulkRemoveRelationshipSchema.body
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};

export const bulkCreateRelationships = async (
  req: ValidatedRequest<unknown, unknown, typeof bulkCreateRelationshipsSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(405).send();
  } catch (error) {
    next(error);
  }
};
