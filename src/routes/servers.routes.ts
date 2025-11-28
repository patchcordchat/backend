import express from 'express';
import { authMiddleware } from '@/middlewares';
import serversController from '@/controllers/servers';
const route = express.Router();

route.get('/:id', authMiddleware, serversController.getServer); // Get Server
route.post('/', authMiddleware, serversController.createServer); // Create Server
route.patch('/:id', authMiddleware, serversController.modifyServer); // Modify Server
route.delete('/:id', authMiddleware, serversController.deleteServer); // Delete Server

route.get('/:id/preview', authMiddleware, serversController.getServerPreview); // Get Server Preview
route.get('/:id/members', authMiddleware, serversController.getServerMembers); // Get Server Members
route.get('/:id/members-search', authMiddleware, serversController.searchServerMembers); // Search Server Members

route.put('/:id/members/@me', authMiddleware, serversController.joinServer); // Join Server
route.post('/:id/members/:user_id', authMiddleware, serversController.addServerMember); // Add Server Member

route.get('/:id/roles', authMiddleware, serversController.getServerRoles); // Get Server Roles

export default route;
