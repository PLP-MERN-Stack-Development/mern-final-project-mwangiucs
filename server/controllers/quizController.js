import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';

export const createQuiz = async (req, res, next) => {
  try {
    const { courseId, title, questions, timeLimit } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor of the course
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);

    const quiz = new Quiz({
      courseId,
      title,
      questions,
      totalPoints,
      timeLimit
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('courseId', 'title');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const getCourseQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId })
      .select('title totalPoints timeLimit createdAt');
    
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

