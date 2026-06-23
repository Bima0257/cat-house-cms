import api from './api';

export const getUsers = (params) => api.get('/api/users', { params });
export const getUser = (id) => api.get(`/api/users/${id}`);
export const createUser = (data) => api.post('/api/users', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateUser = (id, data) => api.post(`/api/users/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
export const toggleUserActive = (id) => api.patch(`/api/users/${id}/toggle-active`);
