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
            res.status(401).json({ error: 'Access denied. No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
        const decoded = jwt.verify(token, jwtSecret) as {
            userId: string;
            email: string;
            matricNumber: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};