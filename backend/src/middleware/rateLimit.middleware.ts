import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            message: 'Too many requests. Please try again after 15 minutes.',
            code: 'RATE_LIMIT_EXCEEDED'
        }
    }
});

export const taskLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            message: 'Too many task actions. Please slow down.',
            code: 'RATE_LIMIT_EXCEEDED'
        }
    }
});
