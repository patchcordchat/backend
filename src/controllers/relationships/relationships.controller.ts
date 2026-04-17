import { Response, Request, NextFunction } from 'express';
// import Relationship, { RELATIONSHIP_TYPES } from '@/models/relationship';
import {
  sendFriendRequestSchema,
  createRelationshipSchema,
  modifyRelationshipSchema,
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
  req: ValidatedRequest<unknown, unknown, typeof createRelationshipSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};

export const ignoreUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};

export const unignoreUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};

export const modifyRelationship = async (
  req: ValidatedRequest<unknown, unknown, typeof modifyRelationshipSchema.body>,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};

export const removeRelationship = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};

export const bulkRemoveRelationships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};

export const bulkCreateRelationships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json('Success');
  } catch (error) {
    next(error);
  }
};
