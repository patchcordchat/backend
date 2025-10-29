import express from 'express';
// import { create, deleteProduct, fetch, fetch2, fetch3, update } from "../controller/orderController.js";

const route = express.Router();

route.get('/', () => {}); // Get Current User
route.patch('/', () => {}); // Modify Current User
route.patch('/account', () => {}); // Modify Current User Account

route.patch('/profile', () => {}); // Modify Current User Profile
route.post('/disable', () => {}); // Disable Current User Account
route.post('/delete', () => {}); // Delete Current User Account

route.get('/guilds', () => {}); // Get Current User Guilds
route.delete('/guilds/:guild_id', () => {}); // Leave Guild

route.get('/channels', () => {}); // Get Private Channels
route.post('/channels', () => {}); // Create Private Channel

export default route;
