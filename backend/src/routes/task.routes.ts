import { Router } from "express";
import { postTask, listTasks, getTask, claimTaskHandler } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { taskLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get('/', listTasks);
router.get('/:id', getTask)

router.post('/', authenticate, taskLimiter, postTask);
router.post('/:id/claim', authenticate, taskLimiter, claimTaskHandler);

export default router;