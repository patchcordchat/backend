import express from 'express';
import { authMiddleware } from '@/middlewares';
import {
  getChannel,
  modifyChannel,
  deleteChannel,
} from '@/controllers/channel/channel.controller';

const route = express.Router();

route.get('/:id', authMiddleware, getChannel); // Get Channel
route.patch('/:id', authMiddleware, modifyChannel); // Modify Channel
route.delete('/:id', authMiddleware, deleteChannel); // Delete Channel

export default route;
