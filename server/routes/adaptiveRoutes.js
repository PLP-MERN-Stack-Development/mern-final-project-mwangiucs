import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { assess, nextLesson, studyPlan } from '../controllers/adaptiveController.js';

const router = express.Router();

router.post('/assess', authenticate, assess);
router.post('/next', authenticate, nextLesson);
router.post('/study-plan', authenticate, studyPlan);

export default router;
