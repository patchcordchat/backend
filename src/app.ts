import express from 'express';
import config from '@/config';
import { errorMiddleware } from '@/middlewares';
import {
  userRoutes,
  serverRoutes,
  channelRoutes,
  authRoutes,
} from '@/routes';

const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(config.app.key));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

export default app;
