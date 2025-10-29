import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import {
  userRoutes,
  serverRoutes,
  channelRoutes,
  currentUserRoutes,
} from './routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users/@me', currentUserRoutes);
app.use('/api/channels', serverRoutes);
app.use('/api/guilds', channelRoutes);

// Middlewares
app.use(errorHandler);

export default app;
