import express from 'express';
import channelsController from '@/controllers/channels';
import messagesRouter from './messages.routes';

const route = express.Router();

route.get('/:id', channelsController.getChannel); // Get Channel
route.patch('/:id', channelsController.modifyChannel); // Modify Channel
route.delete('/:id', channelsController.deleteChannel); // Delete Channel
route.use('/:id/messages', (req, res, next) => {
  req.query.channelId = req.params.id;
  messagesRouter(req, res, next);
});

export default route;
