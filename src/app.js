
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import leadRoutes from './routes/lead.routes.js';
import projectRoutes from './routes/project.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use( cookieParser() );
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => res.json({ name: 'Cult CRM Backend', version: '1.0.0' }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
