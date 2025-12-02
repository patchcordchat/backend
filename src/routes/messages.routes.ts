import express from 'express';
import messagesController from '@/controllers/messages';

const route = express.Router();
route.get('/', messagesController.getMessages);
route.post('/', messagesController.createMessage);

export default route;
