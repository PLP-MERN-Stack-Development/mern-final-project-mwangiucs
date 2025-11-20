import api from './api';

export const assess = async (answers) => {
  const res = await api.post('/adaptive/assess', { answers });
  return res.data;
};

export const nextLesson = async ({ courseId, recentScore = 0 }) => {
  const res = await api.post('/adaptive/next', { courseId, recentScore });
  return res.data;
};

export const studyPlan = async ({ goals = [], pace = 'standard', daysPerWeek = 4 }) => {
  const res = await api.post('/adaptive/study-plan', { goals, pace, daysPerWeek });
  return res.data;
};
