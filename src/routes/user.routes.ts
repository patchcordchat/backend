import express from 'express';
import { authMiddleware } from '@/middlewares';
import { getUser, getUserProfile } from '@/controllers/user/user.controller';

const route = express.Router();

route.get('/:id', authMiddleware, getUser); // Get User
route.get('/:id/profile', authMiddleware, getUserProfile); // Get User Profile

export default route;
