import express from 'express';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// Test endpoint to check stored data (remove in production)
router.get('/data', async (req, res) => {
  try {
    const students = await Student.find().select('-password').lean();
    const courses = await Course.find().lean();
    const enrollments = await Enrollment.find().populate('studentId', 'name email').populate('courseId', 'title').lean();

    res.json({
      students: {
        count: students.length,
        data: students
      },
      courses: {
        count: courses.length,
        data: courses
      },
      enrollments: {
        count: enrollments.length,
        data: enrollments
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

