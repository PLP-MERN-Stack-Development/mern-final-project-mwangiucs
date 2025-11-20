import express from 'express';
import { createQuiz, getQuiz, getCourseQuizzes } from '../controllers/quizController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', authenticate, getCourseQuizzes);
router.get('/:id', authenticate, getQuiz);
router.post('/', authenticate, authorize('instructor', 'admin'), createQuiz);

export default router;

