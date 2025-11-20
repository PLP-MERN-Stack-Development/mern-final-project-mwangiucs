import Progress from '../models/Progress.js';
import Student from '../models/Student.js';

export const updateProgress = async (req, res, next) => {
  try {
    const { courseId, unitId, topicId, subtopicId, completed, points } = req.body;
    const studentId = req.user._id;

    const progressData = {
      studentId,
      courseId,
      ...(unitId && { unitId }),
      ...(topicId && { topicId }),
      ...(subtopicId && { subtopicId }),
      completed: completed !== undefined ? completed : true,
      ...(points && { points })
    };

    if (completed) {
      progressData.completedAt = new Date();
    }

    const progress = await Progress.findOneAndUpdate(
      { studentId, courseId, ...(unitId && { unitId }), ...(topicId && { topicId }), ...(subtopicId && { subtopicId }) },
      progressData,
      { upsert: true, new: true }
    );

    // Update total points if points are provided
    if (points && completed) {
      await Student.findByIdAndUpdate(studentId, {
        $inc: { totalPoints: points }
      });
    }

    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    // Check authorization
    if (req.user._id.toString() !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const progress = await Progress.find({ studentId })
      .populate('courseId', 'title thumbnail')
      .populate('unitId', 'title')
      .populate('topicId', 'title')
      .populate('subtopicId', 'title');

    // Calculate summary statistics
    const summary = {
      totalCompleted: progress.filter(p => p.completed).length,
      totalPoints: progress.reduce((sum, p) => sum + (p.points || 0), 0),
      coursesProgress: {}
    };

    // Group by course
    progress.forEach(p => {
      if (p.courseId) {
        const courseId = p.courseId._id.toString();
        if (!summary.coursesProgress[courseId]) {
          summary.coursesProgress[courseId] = {
            course: p.courseId,
            completed: 0,
            total: 0,
            points: 0
          };
        }
        summary.coursesProgress[courseId].total++;
        if (p.completed) {
          summary.coursesProgress[courseId].completed++;
        }
        summary.coursesProgress[courseId].points += p.points || 0;
      }
    });

    // Calculate percentages
    Object.keys(summary.coursesProgress).forEach(courseId => {
      const courseProgress = summary.coursesProgress[courseId];
      courseProgress.percentage = courseProgress.total > 0 
        ? Math.round((courseProgress.completed / courseProgress.total) * 100)
        : 0;
    });

    res.json({ progress, summary });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const topStudents = await Student.find()
      .select('name email totalPoints')
      .sort({ totalPoints: -1 })
      .limit(10)
      .lean();

    res.json(topStudents);
  } catch (error) {
    next(error);
  }
};

