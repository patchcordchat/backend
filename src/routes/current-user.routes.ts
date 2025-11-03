import express from 'express';
import { authMiddleware } from '@/middlewares';
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
  createCurrentUserPrivateChannel,
} from '@/controllers/currentUser/currentUser.controller';
const route = express.Router();

route.get('/', authMiddleware, getCurrentUser); // Get Current User
route.patch('/', authMiddleware, modifyCurrentUser); // Modify Current User
route.patch('/account', authMiddleware, modifyCurrentUserAccount); // Modify Current User Account

route.patch('/profile', authMiddleware, modifyCurrentUserProfile); // Modify Current User Profile
route.post('/disable', authMiddleware, disableCurrentUserAccount); // Disable Current User Account
route.post('/delete', authMiddleware, deleteCurrentUserAccount); // Delete Current User Account

route.get('/servers', authMiddleware, getCurrentUserServers); // Get Current User Servers
route.delete('/servers/:server_id', authMiddleware, leaveCurrentUserFromServer); // Leave Server

route.get('/channels', authMiddleware, getCurrentUserPrivateChannels); // Get Private Channels
route.post('/channels', authMiddleware, createCurrentUserPrivateChannel); // Create Private Channel

export default route;
