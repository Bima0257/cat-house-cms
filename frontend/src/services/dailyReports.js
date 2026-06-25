import api from './api';

export const getDailyReports = (params) => api.get('/api/daily-reports', { params });
export const getDailyReport = (id) => api.get(`/api/daily-reports/${id}`);
export const createDailyReport = (data) => api.post('/api/daily-reports', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateDailyReport = (id, data) => api.post(`/api/daily-reports/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getDailyReportsByReservation = (reservationId) =>
  api.get(`/api/reservations/${reservationId}/daily-reports`);
