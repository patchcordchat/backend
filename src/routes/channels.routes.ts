import express from 'express';
import channelsController from '@/controllers/channels';
import messagesRouter from './messages.routes';

const route = express.Router();

route.get('/:channel_id', channelsController.getChannel); // Get Channel
route.patch('/:channel_id', channelsController.modifyChannel); // Modify Channel
route.delete('/:channel_id', channelsController.deleteChannel); // Delete Channel
route.post('/:channel_id/typing', channelsController.triggerTyping); // Trigger Typing
route.get('/:channel_id/call', channelsController.getCallEligibility); // Get Call Eligibility
route.use('/:channel_id/messages', messagesRouter);

export default route;
