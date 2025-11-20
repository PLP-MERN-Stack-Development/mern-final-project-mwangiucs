import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';

export const enrollStudent = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId,
      courseId
    });

    await enrollment.save();

    // Update student's enrolled courses
    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: courseId }
    });

    // Update course enrolled count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledCount: 1 }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

export const getEnrollments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    // Check authorization
    if (req.user._id.toString() !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'title description thumbnail instructor category difficulty')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { completedLessons, progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check authorization
    if (enrollment.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (completedLessons) {
      enrollment.completedLessons = [...new Set([...enrollment.completedLessons, ...completedLessons])];
    }
    if (progress !== undefined) {
      enrollment.progress = progress;
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

