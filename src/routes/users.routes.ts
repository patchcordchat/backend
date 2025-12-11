import express from 'express';
import usersController from '@/controllers/users';
import messagesRouter from './messages.routes';
import meRoutes from './me.routes';

const route = express.Router();

route.use('/@me', meRoutes);
route.get('/:user_id', usersController.getUser); // Get User
route.get('/:user_id/profile', usersController.getUserProfile); // Get User Profile
route.use('/:user_id/messages', (req, res, next) => {
  req.query.userId = req.params.user_id;
  messagesRouter(req, res, next);
});


export default route;
