import express from 'express';
import sessionsController from '@/controllers/sessions';

const route = express.Router();
route.get('/', sessionsController.getSessions);
route.post('/logout', sessionsController.logout);

export default route;
