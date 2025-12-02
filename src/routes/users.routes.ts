import express from 'express';
import usersController from '@/controllers/users';
import messagesRouter from './messages.routes';
import meRoutes from './me.routes';

const route = express.Router();

route.use('/@me', meRoutes);
route.get('/:id', usersController.getUser); // Get User
route.get('/:id/profile', usersController.getUserProfile); // Get User Profile
route.use('/:id/messages', (req, res, next) => {
  req.query.userId = req.params.id;
  messagesRouter(req, res, next);
});


export default route;
