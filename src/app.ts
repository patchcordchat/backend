import express from 'express';
import { errorHandler } from '@/middlewares/errorHandler';
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
const cookieParser = require('cookie-parser');

// Middlewares
app.use(errorHandler);
app.use(cors());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users/@me', currentUserRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/auth', authRoutes);

export default app;
