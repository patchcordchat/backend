import express from 'express';
import { authMiddleware } from '@/middlewares';
import channelsController from '@/controllers/channels';
import messagesRouter from './messages.routes';

const route = express.Router();

route.get('/:id', authMiddleware, channelsController.getChannel); // Get Channel
route.patch('/:id', authMiddleware, channelsController.modifyChannel); // Modify Channel
route.delete('/:id', authMiddleware, channelsController.deleteChannel); // Delete Channel
route.use('/:id/messages', (req, res, next) => {
  req.query.channelId = req.params.id;
  messagesRouter(req, res, next);
});

export default route;
