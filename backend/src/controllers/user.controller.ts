import { Request, Response } from 'express';
import { findUserById } from '../models/user.model.js';
import { getTasksByPoster, getCompletedTasksByRunner } from '../models/task.model.js';
import { PublicUserDto } from '../types/index.js';

export const formatPublicUser = (user: any): PublicUserDto => ({
    id: user.id,
    fullName: user.full_name,
    matricNumber: user.matric_number,
    trustTier: 'new',
    avgRating: null,
    avatarUrl: user.avatar_url || null,
    createdAt: user.created_at
});

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

        // Bounded pagination for user task history
        const rawLimit = Number(req.query.limit);
        const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20;

        const posted = await getTasksByPoster(id, limit);
        const completed = await getCompletedTasksByRunner(id, limit);

        res.status(200).json({
            user: formatPublicUser(user),
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
