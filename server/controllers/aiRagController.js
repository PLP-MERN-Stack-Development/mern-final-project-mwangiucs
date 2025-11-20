import { ingestCourseContent, retrieveRelevantChunks } from '../services/ragService.js';

export const ingestCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });
    const result = await ingestCourseContent(courseId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const searchCourse = async (req, res, next) => {
  try {
    const { courseId, query, limit } = req.body;
    if (!courseId || !query) return res.status(400).json({ message: 'courseId and query are required' });
    const result = await retrieveRelevantChunks(courseId, query, Number(limit) || 5);
    res.json({ results: result });
  } catch (error) {
    next(error);
  }
};
