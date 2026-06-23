import api from './api';

export const getCats = (params) => api.get('/api/cats', { params });
export const getCat = (id) => api.get(`/api/cats/${id}`);
export const createCat = (data) => api.post('/api/cats', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateCat = (id, data) => api.post(`/api/cats/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteCat = (id) => api.delete(`/api/cats/${id}`);
