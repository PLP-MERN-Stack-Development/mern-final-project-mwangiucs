import api from './api.js';

export const updateProgress = async (progressData) => {
  const response = await api.post('/progress/update', progressData);
  return response.data;
};

export const getProgress = async (studentId) => {
  const response = await api.get(`/progress/${studentId}`);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/progress/leaderboard/all');
  return response.data;
};

