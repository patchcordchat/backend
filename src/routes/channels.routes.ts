import express from 'express';
import channelsController from '@/controllers/channels';
import messagesRouter from './messages.routes';

const route = express.Router();

route.get('/:channel_id', channelsController.getChannel); // Get Channel
route.patch('/:channel_id', channelsController.modifyChannel); // Modify Channel
route.delete('/:channel_id', channelsController.deleteChannel); // Delete Channel
route.use('/:channel_id/messages', (req, res, next) => {
  req.query.channelId = req.params.channel_id;
  messagesRouter(req, res, next);
});

export default route;
