import { Router } from 'express';
import { register, login, getMe, verifyEmail, resendVerification, forgotPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/signup', register);

router.post('/login', login)

router.get('/me', authenticate, getMe)

router.post('/verify-email', verifyEmail);

router.post('/resend-verification', authLimiter, resendVerification);

router.post('/forgot-password', authLimiter, forgotPassword);


export default router;