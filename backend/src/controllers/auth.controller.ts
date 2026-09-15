import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { findUserByEmailOrMatric, createUser, findUserByEmail, findUserById } from '../models/user.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { pool } from '../config/db.js';

const STUDENT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@student\.oauife\.edu\.ng$/i;

const formatUser = (user: any) => ({
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    schoolEmail: user.email,
    matricNumber: user.matric_number,
    phone: user.phone,
    isVerified: user.is_verified,
    trustTier: 'new',
    avgRating: null,
    avatarUrl: user.avatar_url || null,
    createdAt: user.created_at
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, matricNumber, phone, password } = req.body;
        const email = req.body.email || req.body.schoolEmail;
        const userPhone = typeof phone === 'string' && phone.trim() ? phone.trim() : '08000000000';

        if (
            typeof fullName !== 'string' || !fullName.trim() ||
            typeof email !== 'string' || !email.trim() ||
            typeof matricNumber !== 'string' || !matricNumber.trim() ||
            typeof password !== 'string' || !password
        ) {
            res.status(400).json({
                error: {
                    message: 'Missing required fields. Please provide fullName, email, matricNumber, and password.',
                    code: 'VALIDATION_ERROR'
                }
            });
            return;
        }

        const trimmedEmail = email.toLowerCase().trim();
        const trimmedMatric = matricNumber.toUpperCase().trim();

        if (password.length < 8) {
            res.status(400).json({
                error: {
                    message: 'Password must be at least 8 characters long.',
                    code: 'WEAK_PASSWORD'
                }
            });
            return;
        }

        if (!STUDENT_EMAIL_REGEX.test(trimmedEmail)) {
            res.status(400).json({
                error: {
                    message: 'Registration requires a valid student email (e.g. @student.oauife.edu.ng).',
                    code: 'INVALID_STUDENT_EMAIL'
                }
            });
            return;
        }

        const existingUser = await findUserByEmailOrMatric(trimmedEmail, trimmedMatric);
        if (existingUser) {
            if (existingUser.email.toLowerCase() === trimmedEmail) {
                res.status(409).json({
                    error: {
                        message: 'An account with this email already exists.',
                        code: 'EMAIL_ALREADY_EXISTS'
                    }
                });
                return;
            }
            if (existingUser.matric_number.toUpperCase() === trimmedMatric) {
                res.status(409).json({
                    error: {
                        message: 'An account with this matric number already exists.',
                        code: 'MATRIC_ALREADY_EXISTS'
                    }
                });
                return;
            }
        }

        const passwordHash = await argon2.hash(password);

        const newUser = await createUser({
            fullName: fullName.trim(),
            email: trimmedEmail,
            matricNumber: trimmedMatric,
            phone: userPhone,
            passwordHash
        });

        res.status(201).json({
            message: 'User registered successfully!',
            user: formatUser(newUser)
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error during registration.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email || req.body.schoolEmail;
        const { password } = req.body;

        if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
            res.status(400).json({
                error: {
                    message: 'Please provide both email and password.',
                    code: 'MISSING_CREDENTIALS'
                }
            });
            return;
        }

        const trimmedEmail = email.toLowerCase().trim();
        const user = await findUserByEmail(trimmedEmail);
        if (!user) {
            res.status(401).json({
                error: {
                    message: 'Invalid email or password.',
                    code: 'INVALID_CREDENTIALS'
                }
            });
            return;
        }

        const isPasswordValid = await argon2.verify(user.password_hash, password);
        if (!isPasswordValid) {
            res.status(401).json({
                error: {
                    message: 'Invalid email or password.',
                    code: 'INVALID_CREDENTIALS'
                }
            });
            return;
        }

        if (!user.is_verified) {
            res.status(403).json({
                error: {
                    message: 'Please verify your student email address before logging in.',
                    code: 'EMAIL_NOT_VERIFIED'
                }
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('FATAL: JWT_SECRET environment variable is missing.');
        }

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
        res.status(500).json({
            error: {
                message: 'Internal server error during login.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
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

        const user = await findUserById(req.user.userId);
        if (!user) {
            res.status(404).json({
                error: {
                    message: 'User not found.',
                    code: 'USER_NOT_FOUND'
                }
            });
            return;
        }

        const userDto = formatUser(user);
        res.status(200).json({ user: userDto });
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error fetching profile.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};


// VERIFY EMAIL
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email || req.body.schoolEmail;
        const { code } = req.body;

        if (typeof email !== 'string' || !email.trim() || typeof code !== 'string' || !code.trim()) {
            res.status(400).json({
                error: {
                    message: 'Please provide both email and verification code',
                    code: 'MISSING_CREDENTIALS'
                }
            });
            return;
        }

        const trimmedEmail = email.toLowerCase().trim();
        const user = await findUserByEmail(trimmedEmail);

        if (!user) {
            res.status(404).json({
                error: {
                    message: 'User not found.',
                    code: 'USER_NOT_FOUND'
                }
            });
            return;
        }

        if (code.trim().length !== 6) {
            res.status(400).json({
                error: {
                    message: 'Invalid verification code. Must be 6 digits.',
                    code: 'INVALID_CODE'
                }
            });
            return;
        }

        await pool.query('UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1', [user.id]);
        user.is_verified = true;

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('FATAL: JWT_SECRET is not set');
        }

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
            message: 'Email is verified successfully!',
            token,
            user: formatUser(user)
        });
    } catch (error) {
        console.log('verifyEmail error:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error during email verification.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

// Resend Verification Code
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email || req.body.schoolEmail;
        if (typeof email !== 'string' || !email.trim()) {
            res.status(400).json({
                error: {
                    message: 'Email is required.',
                    code: 'MISSING_EMAIL'
                }
            });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error('resendVerification error', error);
        res.status(500).json({
            error: {
                message: 'Internal server error.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email || req.body.schoolEmail;
        if (typeof email !== 'string' || !email.trim()) {
            res.status(400).json({
                error: {
                    message: 'Email is required.',
                    code: 'MISSING_EMAIL'
                }
            });
            return;
        }
        res.status(204).send();
    } catch (error) {
        console.error('forgotPassword error:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error.',
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
};