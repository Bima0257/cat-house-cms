import api from './api';

export const getPermissionCategories = (params) => api.get('/api/permission-categories', { params });
export const getPermissionCategory = (id) => api.get(`/api/permission-categories/${id}`);
export const createPermissionCategory = (data) => api.post('/api/permission-categories', data);
export const updatePermissionCategory = (id, data) => api.put(`/api/permission-categories/${id}`, data);
export const deletePermissionCategory = (id) => api.delete(`/api/permission-categories/${id}`);
export const assignPermissionToCategory = (catId, permissionId) => api.post(`/api/permission-categories/${catId}/assign`, { permission_id: permissionId });
export const removePermissionFromCategory = (catId, permissionId) => api.delete(`/api/permission-categories/${catId}/permissions/${permissionId}`);
