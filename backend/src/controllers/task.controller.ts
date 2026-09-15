import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { createTask, getOpenTasks, findTaskById, claimTask, formatTask } from '../models/task.model.js';

export const postTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: 'Unauthorized.',
                    code: 'UNAUTHORIZED'
                }
            });
            return;
        }

        const title = req.body.title;
        const description = req.body.description;
        const location = req.body.locationName || req.body.location;
        const fee = req.body.taskPrice !== undefined ? req.body.taskPrice : req.body.fee;
        const proofRequirement = req.body.proofRequirement || '';
        const deadlineAt = req.body.deadlineAt || null;

        if (typeof title !== 'string' || !title.trim()) {
            res.status(400).json({
                error: {
                    message: 'Please provide a valid task title.',
                    code: 'MISSING_TITLE'
                }
            });
            return;
        }

        if (typeof description !== 'string' || !description.trim()) {
            res.status(400).json({
                error: {
                    message: 'Please provide a valid task description.',
                    code: 'MISSING_DESCRIPTION'
                }
            });
            return;
        }

        if (typeof location !== 'string' || !location.trim()) {
            res.status(400).json({
                error: {
                    message: 'Please provide a location for the task.',
                    code: 'MISSING_LOCATION'
                }
            });
            return;
        }

        const numericFee = Number(fee);
        if (!Number.isFinite(numericFee) || numericFee <= 0) {
            res.status(400).json({
                error: {
                    message: 'Task price / fee must be a valid number greater than 0.',
                    code: 'INVALID_FEE'
                }
            });
            return;
        }

        const rawTask = await createTask({
            title,
            description,
            proofRequirement,
            location,
            fee: numericFee,
            posterId: req.user.userId,
            deadlineAt
        });

        // Add user details to format formatted response
        const formatted = formatTask({
            ...rawTask,
            poster_name: req.user.matricNumber || 'Poster'
        });

        res.status(201).json({
            message: 'Task posted successfully!',
            task: formatted
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error creating task.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

export const listTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = Number(req.query.limit) || 20;
        const tasks = await getOpenTasks(limit);
        res.status(200).json({ tasks, nextCursor: null });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error fetching tasks.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const task = await findTaskById(id);
        if (!task) {
            res.status(404).json({
                error: {
                    message: 'Task not found.',
                    code: 'TASK_NOT_FOUND'
                }
            });
            return;
        }
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error fetching task.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

export const claimTaskHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: {
                    message: 'Unauthorized.',
                    code: 'UNAUTHORIZED'
                }
            });
            return;
        }

        const id = req.params.id as string;
        const task = await findTaskById(id);
        if (!task) {
            res.status(404).json({
                error: {
                    message: 'Task not found.',
                    code: 'TASK_NOT_FOUND'
                }
            });
            return;
        }

        if (task.poster.id === req.user.userId) {
            res.status(400).json({
                error: {
                    message: 'You cannot claim your own task.',
                    code: 'CANNOT_CLAIM_OWN_TASK'
                }
            });
            return;
        }

        if (task.status !== 'open') {
            res.status(409).json({
                error: {
                    message: 'This task is no longer open.',
                    code: 'TASK_ALREADY_CLAIMED'
                }
            });
            return;
        }

        const updatedTask = await claimTask(id, req.user.userId);
        if (!updatedTask) {
            res.status(409).json({
                error: {
                    message: 'This task has already been claimed by someone else.',
                    code: 'TASK_ALREADY_CLAIMED'
                }
            });
            return;
        }

        res.status(200).json({
            message: 'Task claimed successfully!',
            task: updatedTask
        });
    } catch (error) {
        console.error('Error claiming task:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error claiming task.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};
