import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { findUserByEmailOrMatric, createUser, findUserByEmail, findUserById } from '../models/user.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';


export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, matricNumber, phone, password } = req.body;

        if (!fullName || !email || !matricNumber || !phone || !password) {
            res.status(400).json({
                error: 'Missing required fields. Please provide fullName, email, matricNumber, phone, and password.'
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({
                error: 'Password must be at least 8 characters long'
            });
            return;
        }

        // Check existing user
        const existingUser = await findUserByEmailOrMatric(email, matricNumber);
        if (existingUser) {
            if (existingUser.email.toLowerCase() === email.toLowerCase().trim()) {
                res.status(409).json({ error: 'An account with this email already exists.' });
                return;
            }
            if (existingUser.matric_number.toLowerCase() === matricNumber.toLowerCase().trim()) {
                res.status(409).json({ error: 'An account with this matirc number already exists.' });
                return;
            }
        }

        const passwordHash = await argon2.hash(password);

        const newUser = await createUser({
            fullName,
            email,
            matricNumber,
            phone,
            passwordHash
        });

        res.status(201).json({
            message: 'User registered sucessfully!',
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Please provide both email and password.' });
            return;
        }

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await argon2.verify(user.password_hash, password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials.' });
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

        const { password_hash, ...safeUser } = user;

        res.status(200).json({
            message: 'Login successful',
            token,
            user: safeUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login.' });
    }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unathorized.' });
            return;
        }

        const user = await findUserById(req.user.userId);
        if (!user) {
            res.status(400).json({ error: 'User not found.' });

            return
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ error: 'Internal server error fetching profile.' });
    }
}