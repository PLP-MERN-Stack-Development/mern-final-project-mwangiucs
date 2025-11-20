import api from './api.js';

export const createCheckout = async (paymentData) => {
  const response = await api.post('/payment/checkout', paymentData);
  return response.data;
};

export const checkAccess = async (params) => {
  const response = await api.get('/payment/access', { params });
  return response.data;
};

export const getPaymentStatus = async (paymentId) => {
  const response = await api.get(`/payment/status/${paymentId}`);
  return response.data;
};

