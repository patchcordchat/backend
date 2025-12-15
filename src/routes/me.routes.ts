import express from 'express';
import meController from '@/controllers/me';
import serversController from '@/controllers/servers';
import channelsController from '@/controllers/channels';
import { validateRequest } from '@/middlewares';
import {
  createPrivateChannelSchema,
  getDMChannelSchema,
} from '@/schemas/channel.schema';
import {
  modifyMeSchema,
  updateMyAccountSchema,
  updateMyProfileSchema,
  disableMyAccountSchema,
  deleteMyAccountSchema,
} from '@/schemas/me.schema';
import {
  getMyServersSchema,
  leaveFromServerSchema,
} from '@/schemas/server.schema';
const route = express.Router();

route.get('/', meController.getMe); // Get Current User

route.patch('/', validateRequest(modifyMeSchema), meController.updateMe); // Modify Current User

route.patch(
  '/account',
  validateRequest(updateMyAccountSchema),
  meController.updateMyAccount,
); // Modify Current User Account

route.patch(
  '/profile',
  validateRequest(updateMyProfileSchema),
  meController.updateMyProfile,
); // Modify Current User Profile

route.post(
  '/disable',
  validateRequest(disableMyAccountSchema),
  meController.disableMyAccount,
); // Disable Current User Account

route.post(
  '/delete',
  validateRequest(deleteMyAccountSchema),
  meController.deleteMyAccount,
); // Delete Current User Account

route.get(
  '/servers',
  validateRequest(getMyServersSchema),
  serversController.getMyServers,
); // Get Current User Servers

route.delete(
  '/servers/:server_id',
  validateRequest(leaveFromServerSchema),
  serversController.leaveFromServer,
); // Leave Server

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
