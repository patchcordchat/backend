import express from 'express';
import { validateRequest } from '@/middlewares';
import {
  deleteChannelSchema,
  getCallEligibilitySchema,
  getChannelSchema,
  modifyChannelSchema,
  triggerTypingSchema,
} from '@/schemas/channel.schema';
import {
  createMessageSchema,
  getMessagesSchema,
  getMessageSchema,
  modifyMessageSchema,
} from '@/schemas/message.schema';
import channelsController from '@/controllers/channels';
import messagesController from '@/controllers/messages';

const route = express.Router();

route.get('/:channel_id', validateRequest(getChannelSchema), channelsController.getChannel); // Get Channel
route.patch('/:channel_id', validateRequest(modifyChannelSchema), channelsController.modifyChannel); // Modify Channel
route.delete(
  '/:channel_id',
  validateRequest(deleteChannelSchema),
  channelsController.deleteChannel,
); // Delete Channel
route.post(
  '/:channel_id/typing',
  validateRequest(triggerTypingSchema),
  channelsController.triggerTyping,
); // Trigger Typing
route.get(
  '/:channel_id/call',
  validateRequest(getCallEligibilitySchema),
  channelsController.getCallEligibility,
); // Get Call Eligibility
route.get(
  '/:channel_id/messages',
  validateRequest(getMessagesSchema),
  messagesController.getMessages,
); // Get Channel Messages
route.get(
  '/:channel_id/messages/:message_id',
  validateRequest(getMessageSchema),
  messagesController.getMessage,
); // Get Message
route.post(
  '/:channel_id/messages',
  validateRequest(createMessageSchema),
  messagesController.createMessage,
); // Create Message
route.patch(
  '/:channel_id/messages/:message_id',
  validateRequest(modifyMessageSchema),
  messagesController.modifyMessage,
); // Modify Message

export default route;
