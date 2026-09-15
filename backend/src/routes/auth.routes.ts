import { Router } from 'express';
import { register, login, getMe, verifyEmail, resendVerification, forgotPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', register);

router.post('/login', login)

router.get('/me', authenticate, getMe)

router.post('/verify-email', verifyEmail);

router.post('/resend-verification', resendVerification);

router.post('/forgot-password', forgotPassword);


export default router;