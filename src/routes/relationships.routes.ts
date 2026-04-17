import express from 'express';
import { validateRequest } from '@/middlewares';
import {
  createRelationshipSchema,
  modifyRelationshipSchema,
  removeRelationshipSchema,
} from '@/schemas/relationship.schema';
import relationshipsController from '@/controllers/relationships';

const route = express.Router();

route.get('/users/@me/relationships', relationshipsController.getRelationships); // Get Relationships

route.put(
  '/users/@me/relationships/:user_id',
  validateRequest(createRelationshipSchema),
  relationshipsController.createRelationship,
); // Create Relationship

route.patch(
  '/users/@me/relationships/:user_id',
  validateRequest(modifyRelationshipSchema),
  relationshipsController.modifyRelationship,
); // Modify Relationship

route.delete(
  '/users/@me/relationships/:user_id',
  validateRequest(removeRelationshipSchema),
  relationshipsController.removeRelationship,
); // Remove Relationship

// route.post(
//   '/users/@me/relationships',
//   validateRequest(sendFriendRequestSchema),
//   relationshipsController.sendFriendRequest,
// ); // Send Friend Request

// route.put('/users/@me/relationships/:user_id/ignore', relationshipsController.ignoreUser); // Ignore User

// route.delete('/users/@me/relationships/:user_id/ignore', relationshipsController.unignoreUser); // Unignore User

// route.delete(
//   '/users/@me/relationships',
//   validateRequest(bulkRemoveRelationshipSchema),
//   relationshipsController.bulkRemoveRelationship,
// ); // Bulk Remove Relationship

// route.post(
//   '/users/@me/relationships/bulk',
//   validateRequest(bulkCreateRelationshipsSchema),
//   relationshipsController.bulkCreateRelationships,
// ); // Bulk Create Relationships

export default route;
