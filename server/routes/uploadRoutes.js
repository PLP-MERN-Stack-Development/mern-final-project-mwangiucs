import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Serve uploaded files
router.use('/files', express.static(path.join(__dirname, '../uploads')));

// Upload course material
router.post('/course/:courseId/material', authenticate, authorize('instructor', 'admin'), upload.single('file'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/api/upload/files/${req.file.filename}`;
    course.materials.push(fileUrl);
    await course.save();

    res.json({ url: fileUrl, message: 'File uploaded successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

