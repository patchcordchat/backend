import express from 'express';
import { authMiddleware } from '@/middlewares';
import meController from '@/controllers/me';
import serversController from '@/controllers/servers';
import channelsController from '@/controllers/channels';
const route = express.Router();

route.get('/', authMiddleware, meController.getMe); // Get Current User
route.patch('/', authMiddleware, meController.updateMe); // Modify Current User
route.patch('/account', authMiddleware, meController.updateMyAccount); // Modify Current User Account

route.patch('/profile', authMiddleware, meController.updateMyProfile); // Modify Current User Profile
route.post('/disable', authMiddleware, meController.disableMyAccount); // Disable Current User Account
route.post('/delete', authMiddleware, meController.deleteMyAccount); // Delete Current User Account

route.get('/servers', authMiddleware, serversController.getMyServers); // Get Current User Servers
route.delete('/servers/:server_id', authMiddleware, serversController.leaveFromServer); // Leave Server

route.get('/channels', authMiddleware, channelsController.getMyPrivateChannels); // Get Private Channels
route.post('/channels', authMiddleware, channelsController.createMyPrivateChannel); // Create Private Channel

export default route;
