import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import './config/db.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Runna backend is live!' });
});

app.use('/auth', authRoutes);

app.use('/tasks', taskRoutes);


app.listen(PORT, () => {
    console.log('Server running');

})