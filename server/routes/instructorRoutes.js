import express from 'express';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get instructor's courses
router.get('/courses', authenticate, authorize('instructor', 'admin'), async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

// Get student progress for a course
router.get('/courses/:courseId/students', authenticate, authorize('instructor', 'admin'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const Enrollment = (await import('../models/Enrollment.js')).default;
    const enrollments = await Enrollment.find({ courseId: req.params.courseId })
      .populate('studentId', 'name email')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

export default router;

