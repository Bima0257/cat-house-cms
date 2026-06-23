import api from './api';

export const getRoles = () => api.get('/api/roles');
export const getRolePermissions = (id) => api.get(`/api/roles/${id}/permissions`);
export const updateRolePermissions = (id, data) => api.put(`/api/roles/${id}/permissions`, data);
