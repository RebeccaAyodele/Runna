import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Runna backend is live!' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Catch-all 404 JSON response for undefined routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: {
            message: `Cannot ${req.method} ${req.path}`,
            code: 'NOT_FOUND'
        }
    });
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        error: {
            message: process.env.NODE_ENV === 'production'
                ? 'Internal server error.'
                : err.message || 'Internal server error.',
            code: err.code || 'INTERNAL_SERVER_ERROR'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});