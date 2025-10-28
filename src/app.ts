import express from 'express';
import itemRoutes from './routes/exampleRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

app.use(errorHandler);

export default app;