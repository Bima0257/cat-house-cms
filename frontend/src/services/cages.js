import api from './api';

export const getCages = (params) => api.get('/api/cages', { params });
export const getCage = (id) => api.get(`/api/cages/${id}`);
export const createCage = (data) => api.post('/api/cages', data);
export const updateCage = (id, data) => api.put(`/api/cages/${id}`, data);
export const deleteCage = (id) => api.delete(`/api/cages/${id}`);
