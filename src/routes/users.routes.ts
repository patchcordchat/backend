import express from 'express';
import { authMiddleware } from '@/middlewares';
import usersController from '@/controllers/users';

const route = express.Router();

route.get('/:id', authMiddleware, usersController.getUser); // Get User
route.get('/:id/profile', authMiddleware, usersController.getUserProfile); // Get User Profile

export default route;
