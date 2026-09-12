import { Router } from "express";
import { postTask, listTasks, getTask, claimTaskHandler } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/', listTasks);
router.get('/:id', getTask)

router.post('/', authenticate, postTask);
router.post('/:id/claim', authenticate, claimTaskHandler);

export default router;