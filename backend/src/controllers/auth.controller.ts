import { Request, Response } from 'express';
import argon2 from 'argon2';
import { findUserByEmailOrMatric, createUser } from '../models/user.model.js';


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