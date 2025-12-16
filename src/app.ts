import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from '@/config';
import { errorMiddleware, authMiddleware } from '@/middlewares';
import { userRoutes, serverRoutes, channelRoutes, authRoutes } from '@/routes';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(
  express.json({
    limit: '50mb',
  }),
);
app.use(cookieParser(config.app.key));

// Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/servers', authMiddleware, serverRoutes);
app.use('/api/channels', authMiddleware, channelRoutes);
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

export default app;
