import api from './api';

export const getServices = (params) => api.get('/api/services', { params });
export const getService = (id) => api.get(`/api/services/${id}`);
export const createService = (data) => api.post('/api/services', data);
export const updateService = (id, data) => api.put(`/api/services/${id}`, data);
export const deleteService = (id) => api.delete(`/api/services/${id}`);
export const toggleServiceActive = (id) => api.patch(`/api/services/${id}/toggle-active`);
export const getPublicServices = () => api.get('/api/services/public');
