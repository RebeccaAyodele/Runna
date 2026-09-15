import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { findUserByEmailOrMatric, createUser, findUserByEmail, findUserById } from '../models/user.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const formatUser = (user: any) => ({
    id: user.id,
    fullName: user.full_name,
    schoolEmail: user.email,
    matricNumber: user.matric_number,
    phone: user.phone,
    isVerified: user.is_verified,
    trustTier: 'new',
    avgRating: null,
    avatarUrl: null,
    createdAt: user.created_at
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, matricNumber, phone, password } = req.body;
        const email = req.body.schoolEmail || req.body.email;
        const userPhone = phone || '08000000000';

        if (!fullName || !email || !matricNumber || !password) {
            res.status(400).json({
                error: 'Missing required fields. Please provide fullName, schoolEmail, matricNumber, and password.'
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long.' });
            return;
        }

        const existingUser = await findUserByEmailOrMatric(email, matricNumber);
        if (existingUser) {
            if (existingUser.email.toLowerCase() === email.toLowerCase().trim()) {
                res.status(409).json({ error: 'An account with this email already exists.' });
                return;
            }
            if (existingUser.matric_number.toLowerCase() === matricNumber.toLowerCase().trim()) {
                res.status(409).json({ error: 'An account with this matric number already exists.' });
                return;
            }
        }

        const passwordHash = await argon2.hash(password);

        const newUser = await createUser({
            fullName,
            email,
            matricNumber,
            phone: userPhone,
            passwordHash
        });

        res.status(201).json({
            message: 'User registered successfully!',
            user: formatUser(newUser)
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.schoolEmail || req.body.email;
        const { password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Please provide both email and password.' });
            return;
        }

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        const isPasswordValid = await argon2.verify(user.password_hash, password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                matricNumber: user.matric_number
            },
            jwtSecret,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: formatUser(user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login.' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }

        const user = await findUserById(req.user.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const formatted = formatUser(user);
        res.status(200).json({ ...formatted, user: formatted });

        res.status(200).json({ user: formatUser(user) });
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ error: 'Internal server error fetching profile.' });
    }
};
