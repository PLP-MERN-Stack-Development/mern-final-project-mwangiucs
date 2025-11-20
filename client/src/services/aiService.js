import api from './api.js';

export const getRecommendations = async () => {
  const response = await api.post('/ai/recommend');
  return response.data;
};

export const gradeQuiz = async (quizId, answers) => {
  const response = await api.post('/ai/grade', { quizId, answers });
  return response.data;
};

export const chatWithAI = async (message, courseId = null) => {
  const response = await api.post('/ai/chat', { message, courseId });
  return response.data;
};

export const getQuizHint = async (quizId, questionIndex, studentAnswer) => {
  const response = await api.post('/ai/quiz/hint', { quizId, questionIndex, studentAnswer });
  return response.data;
};

export const ragIngest = async (courseId) => {
  const response = await api.post('/ai/rag/ingest', { courseId });
  return response.data;
};

export const ragSearch = async (courseId, query, limit = 5) => {
  const response = await api.post('/ai/rag/search', { courseId, query, limit });
  return response.data;
};

export const authorCourse = async ({ prompt, modules, difficulty, category }) => {
  const response = await api.post('/ai/author/course', { prompt, modules, difficulty, category });
  return response.data;
};

