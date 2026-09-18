import { Router } from "express";
import {
    postTask,
    listTasks,
    getTask,
    claimTaskHandler,
    completeTaskHandler,
    confirmTaskHandler,
    disputeTaskHandler,
    cancelTaskHandler
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { taskLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get('/', listTasks);
router.get('/:id', getTask);

router.post('/', authenticate, taskLimiter, postTask);
router.post('/:id/claim', authenticate, taskLimiter, claimTaskHandler);
router.post('/:id/complete', authenticate, taskLimiter, completeTaskHandler);
router.post('/:id/confirm', authenticate, taskLimiter, confirmTaskHandler);
router.post('/:id/dispute', authenticate, taskLimiter, disputeTaskHandler);
router.post('/:id/cancel', authenticate, taskLimiter, cancelTaskHandler);

export default router;