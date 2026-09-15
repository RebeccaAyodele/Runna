import { Request, Response } from 'express';
import { findUserById } from '../models/user.model.js';
import { getTasksByPoster, getCompletedTasksByRunner } from '../models/task.model.js';
import { formatUser } from './auth.controller.js';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const user = await findUserById(id);

        if (!user) {
            res.status(404).json({
                error: {
                    message: 'User not found.',
                    code: 'USER_NOT_FOUND'
                }
            });
            return;
        }

        const posted = await getTasksByPoster(id);
        const completed = await getCompletedTasksByRunner(id);

        res.status(200).json({
            user: formatUser(user),
            posted,
            completed,
            ratingsCount: 0
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error fetching user profile.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};
