import api from './api.js';

export const enrollInCourse = async (courseId) => {
  const response = await api.post('/enroll', { courseId });
  return response.data;
};

export const getEnrollments = async (studentId) => {
  const response = await api.get(`/enrollments/${studentId}`);
  return response.data;
};

export const updateProgress = async (enrollmentId, progressData) => {
  const response = await api.put(`/enrollments/${enrollmentId}/progress`, progressData);
  return response.data;
};

