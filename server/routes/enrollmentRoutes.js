import express from 'express';
import { enrollStudent, getEnrollments, updateProgress } from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, enrollStudent);
// Support POST /api/enroll/:id to satisfy assignment spec
router.post('/:id', authenticate, (req, res, next) => {
  if (!req.body.courseId && req.params.id) {
    req.body.courseId = req.params.id;
  }
  return enrollStudent(req, res, next);
});
router.post('/enroll', authenticate, enrollStudent); // Alias for POST /api/enroll
router.get('/:studentId', authenticate, getEnrollments);
router.put('/:enrollmentId/progress', authenticate, updateProgress);

export default router;

