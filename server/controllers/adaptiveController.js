import { initialAssessment, decideNextLesson, generateStudyPlan } from '../services/adaptiveService.js';

export const assess = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const result = await initialAssessment({ answers });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const nextLesson = async (req, res, next) => {
  try {
    const { courseId, recentScore } = req.body;
    const studentId = req.user._id;
    const result = await decideNextLesson({ studentId, courseId, recentScore: Number(recentScore) || 0 });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const studyPlan = async (req, res, next) => {
  try {
    const { goals, pace, daysPerWeek } = req.body;
    const result = await generateStudyPlan({ studentName: req.user?.name, goals, pace, daysPerWeek });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
