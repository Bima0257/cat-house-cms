import api from './api';

export const getNotifications = (params) => api.get('/api/notifications', { params });
export const getUnreadNotifications = () => api.get('/api/notifications/unread');
export const markAsRead = (id) => api.post(`/api/notifications/${id}/read`);
export const markAllAsRead = () => api.post('/api/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/api/notifications/${id}`);
