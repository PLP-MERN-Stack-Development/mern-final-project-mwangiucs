import express from 'express';
import { getUnitsByCourse, createUnit, createTopic, createSubtopic } from '../controllers/unitController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', authenticate, getUnitsByCourse);
router.post('/unit', authenticate, authorize('instructor', 'admin'), createUnit);
router.post('/topic', authenticate, authorize('instructor', 'admin'), createTopic);
router.post('/subtopic', authenticate, authorize('instructor', 'admin'), createSubtopic);

export default router;

