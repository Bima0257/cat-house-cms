import api from './api';

export const getPayments = (params) => api.get('/api/payments', { params });
export const getPayment = (id) => api.get(`/api/payments/${id}`);
export const createPayment = (data) => api.post('/api/payments', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const verifyPayment = (id) => api.post(`/api/payments/${id}/verify`);
export const rejectPayment = (id) => api.post(`/api/payments/${id}/reject`);
