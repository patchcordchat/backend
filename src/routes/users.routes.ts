import express from 'express';
import { authMiddleware } from '@/middlewares';
import usersController from '@/controllers/users';
import messagesRouter from './messages.routes';
import meRoutes from './me.routes';

const route = express.Router();

route.get('/:id', authMiddleware, usersController.getUser); // Get User
route.get('/:id/profile', authMiddleware, usersController.getUserProfile); // Get User Profile
route.use('/:id/messages', (req, res, next) => {
  req.query.userId = req.params.id;
  messagesRouter(req, res, next);
});

route.use('/@me', meRoutes);

export default route;
