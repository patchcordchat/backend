import express from 'express';
// import { create, deleteProduct, fetch, fetch2, fetch3, update } from "../controller/orderController.js";

const route = express.Router();

route.get('/:id', () => {}); // Get Server
route.post('/', () => {}); // Create Server
route.patch('/:id', () => {}); // Modify Server
route.delete('/:id', () => {}); // Delete Server

route.get('/:id/preview', () => {}); // Get Server Preview
route.get('/:id/members', () => {}); // Get Server Members
route.get('/:id/members-search', () => {}) // Search Server Members

route.put('/:id/members/@me', () => {}); // Join Server
route.post('/:id/members/:user_id', () => {}); // Add Guild Member

route.get('/:id/roles') // Get Guild Roles

export default route;
