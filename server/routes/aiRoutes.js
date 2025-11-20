import express from 'express';
import { recommendCourses, gradeSubmission, chat, quizHint, authorCourse } from '../controllers/aiController.js';
import { ingestCourse, searchCourse } from '../controllers/aiRagController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/recommend', authenticate, recommendCourses);
router.post('/grade', authenticate, gradeSubmission);
router.post('/chat', authenticate, chat);
router.post('/quiz/hint', authenticate, quizHint);
router.post('/author/course', authenticate, authorCourse);

// Local RAG endpoints
router.post('/rag/ingest', authenticate, ingestCourse);
router.post('/rag/search', authenticate, searchCourse);

export default router;

