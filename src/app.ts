import express from 'express';
import { errorMiddleware } from '@/middlewares';
import {
  userRoutes,
  serverRoutes,
  channelRoutes,
  currentUserRoutes,
  authRoutes,
} from '@/routes';

const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Middlewares
app.use(errorMiddleware);
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users/@me', currentUserRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/auth', authRoutes);

export default app;
