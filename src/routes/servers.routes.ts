import express from 'express';
import serversController from '@/controllers/servers';
const route = express.Router();

route.get('/:id', serversController.getServer); // Get Server
route.post('/', serversController.createServer); // Create Server
route.patch('/:id', serversController.modifyServer); // Modify Server
route.delete('/:id', serversController.deleteServer); // Delete Server

route.get('/:id/preview', serversController.getServerPreview); // Get Server Preview
route.get('/:id/members', serversController.getServerMembers); // Get Server Members
route.get('/:id/members-search', serversController.searchServerMembers); // Search Server Members

route.put('/:id/members/@me', serversController.joinServer); // Join Server
route.post('/:id/members/:user_id', serversController.addServerMember); // Add Server Member

route.get('/:id/roles', serversController.getServerRoles); // Get Server Roles

export default route;
