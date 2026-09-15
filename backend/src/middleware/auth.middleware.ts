import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        matricNumber: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(401).json({
                error:
                {
                    message: 'Access denied. No token provided',
                    code: 'UNAUTHORIZED'
                }
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('FATAL: JWT_SECRET environment variable is missing.');
        }

        const decoded = jwt.verify(token, jwtSecret) as {
            userId: string;
            email: string;
            matricNumber: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            error:
            {
                message: 'Invalid or expired token.',
                code: 'INVALID TOKEN'
            }
        });
    }
};