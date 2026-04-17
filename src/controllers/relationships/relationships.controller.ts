import { Response, Request, NextFunction } from 'express';
// import Relationship, { RELATIONSHIP_TYPES } from '@/models/relationship';
import {
  sendFriendRequestSchema,
  createRelationshipSchema,
  modifyRelationshipSchema,
  ignoreUserSchema,
  bulkRemoveRelationshipSchema,
  bulkCreateRelationshipsSchema,
} from '@/schemas/relationship.schema';

// const POPULATE_USER_FIELDS = 'username global_name avatar public_flags bot';

export const getRelationships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
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
    res.json('Success');
  } catch (error) {
    next(error);
  }
};
