import express from 'express';
import { validateRequest } from '@/middlewares';
import {
  createRelationshipSchema,
  modifyRelationshipSchema,
  removeRelationshipSchema,
  sendFriendRequestSchema,
  bulkRemoveRelationshipSchema,
  bulkCreateRelationshipsSchema,
} from '@/schemas/relationship.schema';
import relationshipsController from '@/controllers/relationships';

const route = express.Router();

route.get('/', relationshipsController.getRelationships); // Get Relationships

route.put(
  '/:user_id',
  validateRequest(createRelationshipSchema),
  relationshipsController.createRelationship,
); // Create Relationship

route.patch(
  '/:user_id',
  validateRequest(modifyRelationshipSchema),
  relationshipsController.modifyRelationship,
); // Modify Relationship

route.delete(
  '/:user_id',
  validateRequest(removeRelationshipSchema),
  relationshipsController.removeRelationship,
); // Remove Relationship

route.post(
  '/',
  validateRequest(sendFriendRequestSchema),
  relationshipsController.sendFriendRequest,
); // Send Friend Request

route.put('/:user_id/ignore', relationshipsController.ignoreUser); // Ignore User

route.delete('/:user_id/ignore', relationshipsController.unignoreUser); // Unignore User

route.delete(
  '',
  validateRequest(bulkRemoveRelationshipSchema),
  relationshipsController.bulkRemoveRelationships,
); // Bulk Remove Relationship

route.post(
  '/bulk',
  validateRequest(bulkCreateRelationshipsSchema),
  relationshipsController.bulkCreateRelationships,
); // Bulk Create Relationships

export default route;
