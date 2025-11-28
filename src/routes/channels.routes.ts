import express from 'express';
import { authMiddleware } from '@/middlewares';
import channelsController from '@/controllers/channels';

const route = express.Router();

route.get('/:id', authMiddleware, channelsController.getChannel); // Get Channel
route.patch('/:id', authMiddleware, channelsController.modifyChannel); // Modify Channel
route.delete('/:id', authMiddleware, channelsController.deleteChannel); // Delete Channel

export default route;
