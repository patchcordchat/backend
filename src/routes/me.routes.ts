import express from 'express';
import meController from '@/controllers/me';
import serversController from '@/controllers/servers';
import channelsController from '@/controllers/channels';
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
route.post('/channels', channelsController.createPrivateChannel); // Create Private Channel

export default route;
