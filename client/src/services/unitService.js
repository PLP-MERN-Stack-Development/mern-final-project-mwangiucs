import api from './api.js';

export const getUnitsByCourse = async (courseId) => {
  const response = await api.get(`/units/course/${courseId}`);
  return response.data;
};

export const createUnit = async (unitData) => {
  const response = await api.post('/units/unit', unitData);
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await api.post('/units/topic', topicData);
  return response.data;
};

export const createSubtopic = async (subtopicData) => {
  const response = await api.post('/units/subtopic', subtopicData);
  return response.data;
};

