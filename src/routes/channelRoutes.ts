import express from 'express';
import {
  getServer,
  createServer,
  modifyServer,
  deleteServer,
  getServerPreview,
  getServerMembers,
  searchServerMember,
  joinServer,
  addServerMember,
  getServerRoles
} from '@/controllers/channelController';

const route = express.Router();

route.get('/:id', getServer); // Get Server
route.post('/', createServer); // Create Server
route.patch('/:id', modifyServer); // Modify Server
route.delete('/:id', deleteServer); // Delete Server

route.get('/:id/preview', getServerPreview); // Get Server Preview
route.get('/:id/members', getServerMembers); // Get Server Members
route.get('/:id/members-search', searchServerMember); // Search Server Members

route.put('/:id/members/@me', joinServer); // Join Server
route.post('/:id/members/:user_id', addServerMember); // Add Server Member

route.get('/:id/roles', getServerRoles); // Get Server Roles

export default route;
