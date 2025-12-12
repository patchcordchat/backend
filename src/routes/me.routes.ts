import express from 'express';
import meController from '@/controllers/me';
import serversController from '@/controllers/servers';
import channelsController from '@/controllers/channels';
import { validateRequest } from '@/middlewares';
import {
  createPrivateChannelSchema,
  getDMChannelSchema,
} from '@/schemas/channel.schema';
const route = express.Router();

route.get('/', meController.getMe); // Get Current User
route.patch('/', meController.updateMe); // Modify Current User
route.patch('/account', meController.updateMyAccount); // Modify Current User Account

route.patch('/profile', meController.updateMyProfile); // Modify Current User Profile
route.post('/disable', meController.disableMyAccount); // Disable Current User Account
route.post('/delete', meController.deleteMyAccount); // Delete Current User Account

route.get('/servers', serversController.getMyServers); // Get Current User Servers
route.delete('/servers/:server_id', serversController.leaveFromServer); // Leave Server

route.get('/channels', channelsController.getPrivateChannels); // Get Private Channels
route.post(
  '/channels',
  validateRequest(createPrivateChannelSchema),
  channelsController.createPrivateChannel,
); // Create Private Channel
route.get(
  '/dms/:user_id',
  validateRequest(getDMChannelSchema),
  channelsController.getDMChannel,
); // Get DM Channel

export default route;
