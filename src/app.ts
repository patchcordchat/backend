import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from '@/config';
import { errorMiddleware, authMiddleware } from '@/middlewares';
import { userRoutes, serverRoutes, channelRoutes, authRoutes } from '@/routes';

const app = express();

app.use(cors());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'tiny'));
app.use(
  express.json({
    limit: '50mb',
  }),
);
app.use(cookieParser(config.app.key));

// Routes
app.use('/users', authMiddleware, userRoutes);
app.use('/servers', authMiddleware, serverRoutes);
app.use('/channels', authMiddleware, channelRoutes);
app.use('/auth', authRoutes);
app.use(errorMiddleware);

export default app;
