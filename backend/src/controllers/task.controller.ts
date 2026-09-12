import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { createTask, getOpenTasks, findTaskById, claimTask } from '../models/task.model.js';

export const postTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized.' });

            return;
        }

        const { title, description, location, fee } = req.body;

        if (!title || !description || !location || fee === undefined) {
            res.status(400).json({ error: 'Fee must be greater than 0' });
            return;
        }

        if (Number(fee) <= 0) {
            res.status(400).json({ error: 'Fee must be greater than 0.' });
            return;
        }

        const task = await createTask({
            title,
            description,
            location,
            fee: Number(fee),
            posterId: req.user.userId
        });

        res.status(201).json({ message: 'Task posted successfully!', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error creating task.' })
    };
}


export const listTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await getOpenTasks();
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error fetching tasks.' });
    }
};


export const getTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const task = await findTaskById(id);
        if (!task) {
            res.status(404).json({ error: 'Task not found.' });
            return;
        }
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({ error: 'Internal server error fetching task.' });
    }
};


export const claimTaskHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const id = req.params.id as string
        const task = await findTaskById(id);
        if (!task) {
            res.status(404).json({ error: 'Task not found.' });
            return;
        }
        if (task.poster_id === req.user.userId) {
            res.status(400).json({ error: 'You cannot claim your own task.' });
            return;
        }
        if (task.status !== 'OPEN') {
            res.status(409).json({ error: 'This task is no longer open.' });
            return;
        }
        const updatedTask = await claimTask(id, req.user.userId);
        res.status(200).json({ message: 'Task claimed successfully!', task: updatedTask });
    } catch (error) {
        console.error('Error claiming task:', error);
        res.status(500).json({ error: 'Internal server error claiming task.' });
    }
};
