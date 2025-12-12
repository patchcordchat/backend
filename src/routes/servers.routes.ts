import express from 'express';
import serversController from '@/controllers/servers';
import { validateRequest } from '@/middlewares';
import {
  getServerSchema,
  createServerSchema,
  modifyServerSchema,
  deleteServerSchema,
  getServerPreviewSchema,
  getServerMembersSchema,
  searchServerMembersSchema,
  joinServerSchema,
  addServerMemberSchema,
  getServerRolesSchema,
} from '@/schemas/server.schema';
import {
  getServerChannelsSchema,
  createServerChannelSchema,
  modifyChannelPositionSchema,
} from '@/schemas/channel.schema';
import channelsController from '@/controllers/channels';

const route = express.Router();

route.get(
  '/:server_id',
  validateRequest(getServerSchema),
  serversController.getServer,
); // Get Server

route.post(
  '/',
  validateRequest(createServerSchema),
  serversController.createServer,
); // Create Server

route.patch(
  '/:server_id',
  validateRequest(modifyServerSchema),
  serversController.modifyServer,
); // Modify Server

route.delete(
  '/:server_id',
  validateRequest(deleteServerSchema),
  serversController.deleteServer,
); // Delete Server

route.get(
  '/:server_id/preview',
  validateRequest(getServerPreviewSchema),
  serversController.getServerPreview,
); // Get Server Preview

route.get(
  '/:server_id/members',
  validateRequest(getServerMembersSchema),
  serversController.getServerMembers,
); // Get Server Members

route.post(
  '/:server_id/members-search',
  validateRequest(searchServerMembersSchema),
  serversController.searchServerMembers,
); // Search Server Members

route.put(
  '/:server_id/members/@me',
  validateRequest(joinServerSchema),
  serversController.joinServer,
); // Join Server

route.post(
  '/:server_id/members/:user_id',
  validateRequest(addServerMemberSchema),
  serversController.addServerMember,
); // Add Server Member

route.get(
  '/:server_id/roles',
  validateRequest(getServerRolesSchema),
  serversController.getServerRoles,
); // Get Server Roles

route.get(
  '/:server_id/channels',
  validateRequest(getServerChannelsSchema),
  channelsController.getServerChannels,
);

route.post(
  '/:server_id/channels',
  validateRequest(createServerChannelSchema),
  channelsController.createServerChannel,
);

route.patch(
  '/:server_id/channels',
  validateRequest(modifyChannelPositionSchema),
  channelsController.modifyChannelPosition,
);

export default route;
