import express from 'express';
import { errorHandler } from '@/middlewares/errorHandler';
import {
  userRoutes,
  serverRoutes,
  channelRoutes,
  currentUserRoutes,
} from '@/routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users/@me', currentUserRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);

// Middlewares
app.use(errorHandler);

export default app;
