import api from './api';

export const getDashboardStats = () => api.get('/api/dashboard/stats');
export const getRecentReservations = () => api.get('/api/dashboard/recent-reservations');
export const getRevenueChart = () => api.get('/api/dashboard/revenue-chart');
