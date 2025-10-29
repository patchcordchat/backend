import express from 'express';
import {
  getCurrentUser,
  modifyCurrentUser,
  modifyCurrentUserAccount,
  modifyCurrentUserProfile,
  disableCurrentUserAccount,
  deleteCurrentUserAccount,
  getCurrentUserServers,
  leaveCurrentUserFromServer,
  getCurrentUserPrivateChannels,
  createCurrentUserPrivateChannel
} from '@/controllers/currentUser/currentUser.controller';
const route = express.Router();

route.get('/', getCurrentUser); // Get Current User
route.patch('/', modifyCurrentUser); // Modify Current User
route.patch('/account', modifyCurrentUserAccount); // Modify Current User Account

route.patch('/profile', modifyCurrentUserProfile); // Modify Current User Profile
route.post('/disable', disableCurrentUserAccount); // Disable Current User Account
route.post('/delete', deleteCurrentUserAccount); // Delete Current User Account

route.get('/servers', getCurrentUserServers); // Get Current User Servers
route.delete('/servers/:server_id', leaveCurrentUserFromServer); // Leave Server

route.get('/channels', getCurrentUserPrivateChannels); // Get Private Channels
route.post('/channels', createCurrentUserPrivateChannel); // Create Private Channel

export default route;
