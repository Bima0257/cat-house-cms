import api from './api';

export const getPermissions = (params) => api.get('/api/permissions', { params });
export const createPermission = (data) => api.post('/api/permissions', data);
export const updatePermission = (id, data) => api.put(`/api/permissions/${id}`, data);
export const deletePermission = (id) => api.delete(`/api/permissions/${id}`);
