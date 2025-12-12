import express from 'express';
import usersController from '@/controllers/users';
import meRoutes from './me.routes';
import messagesController from '@/controllers/messages';
import {
  getDMMessagesSchema,
  createDMMessageSchema,
  modifyDMMessageSchema,
} from '@/schemas/message.schema';
import { validateRequest } from '@/middlewares';

const route = express.Router();

route.use('/@me', meRoutes);
route.get('/:user_id', usersController.getUser); // Get User
route.get('/:user_id/profile', usersController.getUserProfile); // Get User Profile
route.use(
  '/:user_id/messages',
  validateRequest(getDMMessagesSchema),
  messagesController.getDMMessages,
); // Get DM Messages
route.post(
  '/:user_id/messages',
  validateRequest(createDMMessageSchema),
  messagesController.createDMMessage,
); // Create DM Message
route.patch(
  '/:user_id/messages/:message_id',
  validateRequest(modifyDMMessageSchema),
  messagesController.modifyDMMessage,
); // Modify DM Message

export default route;
