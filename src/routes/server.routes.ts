import express from 'express';
import { authMiddleware } from '@/middlewares';
import {
  getServer,
  createServer,
  modifyServer,
  deleteServer,
  getServerPreview,
  getServerMembers,
  searchServerMembers,
  joinServer,
  addServerMember,
  getServerRoles,
} from '@/controllers/server/server.controller';
const route = express.Router();

route.get('/:id', authMiddleware, getServer); // Get Server
route.post('/', authMiddleware, createServer); // Create Server
route.patch('/:id', authMiddleware, modifyServer); // Modify Server
route.delete('/:id', authMiddleware, deleteServer); // Delete Server

route.get('/:id/preview', authMiddleware, getServerPreview); // Get Server Preview
route.get('/:id/members', authMiddleware, getServerMembers); // Get Server Members
route.get('/:id/members-search', authMiddleware, searchServerMembers); // Search Server Members

route.put('/:id/members/@me', authMiddleware, joinServer); // Join Server
route.post('/:id/members/:user_id', authMiddleware, addServerMember); // Add Server Member

route.get('/:id/roles', authMiddleware, getServerRoles); // Get Server Roles

export default route;
