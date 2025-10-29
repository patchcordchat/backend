import express from 'express';
import { getUser, getUserProfile } from '@/controllers/userController';

const route = express.Router();

route.get('/:id', getUser); // Get User
route.get('/:id/profile', getUserProfile); // Get User Profile

export default route;
