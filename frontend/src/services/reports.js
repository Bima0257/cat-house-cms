import api from './api';

export const getReservationReport = (params) =>
  api.get('/api/reports/reservations', { params });

export const getFinancialReport = (params) =>
  api.get('/api/reports/financial', { params });

export const getCatReport = (params) =>
  api.get('/api/reports/cats', { params });

export const exportReservationPdf = (params) =>
  api.get('/api/reports/reservations/export', { params, responseType: 'blob' });

export const exportFinancialPdf = (params) =>
  api.get('/api/reports/financial/export', { params, responseType: 'blob' });

export const exportCatPdf = (params) =>
  api.get('/api/reports/cats/export', { params, responseType: 'blob' });
