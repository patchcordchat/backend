import express from 'express';
import {
  getChannel,
  modifyChannel,
  deleteChannel,
} from '@/controllers/channel/channel.controller';

const route = express.Router();

route.get('/:id', getChannel); // Get Channel
route.patch('/:id', modifyChannel); // Modify Channel
route.delete('/:id', deleteChannel); // Delete Channel

export default route;
